import argparse, ctypes, json, os, subprocess, time
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import render_variants as rv

ROOT=os.path.dirname(os.path.abspath(__file__))
FPS=25;SECONDS=8;W,H=720,1280;G=540
lib=ctypes.CDLL(ROOT+'/motion_renderer.so')
native=lib.render
native.argtypes=[ctypes.c_void_p,ctypes.c_int,ctypes.c_int,ctypes.c_int,ctypes.c_float]
pixels=np.zeros((G,G,4),dtype=np.uint8)
def clamp(x):return min(1,max(0,x))
def ease(x):return 1-(1-clamp(x))**3
def fade(layer,a):
    if a>=.999:return layer
    layer=layer.copy();layer.putalpha(layer.getchannel('A').point(lambda v:round(v*clamp(a))))
    return layer
def project(kind,v):
    eye=np.array([0,12,16.]) if kind==0 else np.array([0,7,23.])
    target=np.array([0,.3,0]) if kind==0 else np.array([0,2.65,0])
    span=8.9 if kind==0 else 9.4
    f=target-eye;f/=np.linalg.norm(f);r=np.cross(f,[0,1,0]);r/=np.linalg.norm(r);u=np.cross(r,f);q=np.array(v)-eye
    return (540+np.dot(q,r)/span*1080,1190-np.dot(q,u)/span*1080)

configs=[
 ('02','ΠΟΥ ΠΑΝΕ','ΤΑ ΧΡΗΜΑΤΑ','ΚΑΤΑΝΟΜΗ ΔΑΠΑΝΩΝ','38%','ΣΤΕΓΑΣΗ','ΤΟ ΜΕΓΑΛΥΤΕΡΟ ΜΕΡΙΔΙΟ'),
 ('03','Η ΑΝΟΔΟΣ','ΣΕ ΜΙΑ ΓΡΑΜΜΗ','ΕΞΕΛΙΞΗ 2021–2025','+32','ΜΟΝΑΔΕΣ','ΑΠΟ ΤΟ 2021 ΣΤΟ 2025'),
 ('04','ΠΟΙΟΣ ΕΙΝΑΙ','ΜΠΡΟΣΤΑ','ΣΥΓΚΡΙΣΗ ΤΕΣΣΑΡΩΝ ΧΩΡΩΝ','4','ΧΩΡΕΣ','ΜΙΑ ΚΟΙΝΗ ΚΛΙΜΑΚΑ'),
 ('05','7 ΣΤΟΥΣ 10','ΠΟΛΙΤΕΣ','ΑΝΑΛΟΓΙΑ ΠΛΗΘΥΣΜΟΥ','70%','ΕΛΛΑΔΑ','7 ΑΠΟ ΚΑΘΕ 10'),
 ('06','ΠΡΙΝ','ΚΑΙ ΜΕΤΑ','ΣΥΓΚΡΙΣΗ ΔΥΟ ΧΡΟΝΙΚΩΝ ΣΗΜΕΙΩΝ','+25','ΜΟΝΑΔΕΣ','ΜΕΣΑ ΣΕ ΜΙΑ ΔΕΚΑΕΤΙΑ'),
 ('07','ΠΩΣ ΜΟΙΡΑΖΕΤΑΙ','ΤΟ ΣΥΝΟΛΟ','ΣΥΓΚΡΙΣΗ ΚΑΤΑΝΟΜΩΝ','100%','ΣΥΝΟΛΟ','ΙΔΙΑ ΒΑΣΗ ΣΥΓΚΡΙΣΗΣ')]
names=['donut','line','ranking','population','before-after','stacked']
sources=json.load(open(ROOT+'/chart-sources.json'))
def source_text(kind):
    s=sources[names[kind]]
    if s.get('is_demo'):return 'ΠΗΓΗ: — · ΔΟΚΙΜΑΣΤΙΚΑ ΣΤΟΙΧΕΙΑ'
    if not all(s.get(k) for k in ['organization','period','url']):
        raise ValueError('A non-demo scene requires organization, reference period, and source URL.')
    return 'ΠΗΓΗ: '+' · '.join(s[k] for k in ['organization','study','period'] if s.get(k))
background=rv.base(*configs[0])
fontcache={}
def font(size,bold=True):
    key=size,bold
    if key not in fontcache:fontcache[key]=ImageFont.truetype(rv.BOLD if bold else rv.FONT,size)
    return fontcache[key]
def txt(d,x,y,s,size=40,color='#f6f7ff',bold=True,center=False):
    ff=font(size,bold)
    if center:x-=d.textlength(s,font=ff)/2
    d.text((x,y),s,font=ff,fill=color)
def flag(d,country,cx,cy):
    if country==0:
        for j,c in enumerate(['#161616','#d9283d','#ffc735']):d.rectangle((cx-22,cy-14+j*9,cx+22,cy-6+j*9),fill=c)
    elif country in [1,2]:
        cs=['#2359bb','#fff','#e73347'] if country==1 else ['#22a269','#fff','#e73347']
        for j,c in enumerate(cs):d.rectangle((cx-22+j*15,cy-14,cx-8+j*15,cy+13),fill=c)
    elif country==3:
        d.rectangle((cx-22,cy-14,cx+22,cy+13),fill='#fff')
        for j in range(0,9,2):d.rectangle((cx-22,cy-14+j*3,cx+22,cy-12+j*3),fill='#2469d7')
        d.rectangle((cx-22,cy-14,cx-8,cy),fill='#2469d7');d.rectangle((cx-16,cy-14,cx-14,cy),fill='#fff');d.rectangle((cx-22,cy-8,cx-8,cy-6),fill='#fff')
    else:
        d.rectangle((cx-22,cy-14,cx+22,cy+14),fill='#1745b5')
        for j in range(12):
            a=j*np.pi/6;x=cx+9*np.sin(a);y=cy-9*np.cos(a)
            d.ellipse((x-1.3,y-1.3,x+1.3,y+1.3),fill='#ffe252')

def annotations(kind,t,p):
    layer=Image.new('RGBA',(1080,1920));d=ImageDraw.Draw(layer)
    if kind==0:
        labels=[('ΣΤΕΓΑΣΗ','38%','#ff315c',0),('ΤΡΟΦΙΜΑ','24%','#7895ff',.38),('ΜΕΤΑΦΟΡΕΣ','18%','#b486ff',.62),('ΑΛΛΑ','20%','#95b0d4',.8)]
        for i,(name,val,col,start) in enumerate(labels):
            item=Image.new('RGBA',layer.size);dd=ImageDraw.Draw(item);x=84+i%2*475;y=1506+i//2*111
            dd.rounded_rectangle((x,y+9,x+12,y+38),radius=4,fill=col)
            txt(dd,x+30,y,name,27);txt(dd,x+30,y+39,val,39,col)
            layer.alpha_composite(fade(item,clamp((p-start)*8)))
    elif kind==1:
        grid=Image.new('RGBA',layer.size);gd=ImageDraw.Draw(grid)
        for val in [0,40,80]:
            a=project(kind,[-3.45,val*.064,0]);b=project(kind,[3.45,val*.064,0]);gd.line((a,b),fill=(134,152,195,65),width=1)
        layer.alpha_composite(fade(grid,ease((t-.4)/.6)))
        for i,v in enumerate([42,48,55,66,74]):
            node=Image.new('RGBA',layer.size);dd=ImageDraw.Draw(node);x,y=project(kind,[-3.45+i*1.725,v*.064,0]);bx,by=project(kind,[-3.45+i*1.725,0,0])
            txt(dd,x,y-84,str(v)+'%',43,'#ff6386' if i==4 else '#f6f7ff',center=True)
            # Fade the value in when its actual point has been drawn.
            arrival=.9+3.6*(1-(1-i/4)**(1/3)) if i<4 else 4.5
            layer.alpha_composite(fade(node,ease((t-arrival)/.35)))
            years=Image.new('RGBA',layer.size);yd=ImageDraw.Draw(years);yd.line((bx,by-10,bx,by+6),fill='#8698bd',width=2)
            txt(yd,bx,by+25,str(2021+i),35,center=True)
            layer.alpha_composite(fade(years,ease((t-.4-i*.06)/.4)))
        summary=Image.new('RGBA',layer.size);sd=ImageDraw.Draw(summary)
        txt(sd,85,1607,'42%  →  74%',53);txt(sd,85,1690,'ΣΤΑΘΕΡΑ ΑΝΟΔΙΚΗ ΠΟΡΕΙΑ',27,'#a7b3cf',False)
        layer.alpha_composite(fade(summary,ease((t-4.5)/.5)))
    elif kind==2:
        for i,(name,v) in enumerate(zip(['ΓΕΡΜΑΝΙΑ','ΓΑΛΛΙΑ','ΙΤΑΛΙΑ','ΕΛΛΑΔΑ'],[82,71,64,48])):
            item=Image.new('RGBA',layer.size);dd=ImageDraw.Draw(item);bp=ease((t-.9-i*.28)/2.5)
            _,cy=project(kind,[-3.75,5.25-i*1.42,0]);txt(dd,163,cy-94,name,33);flag(dd,i,124,cy-75)
            ex,ey=project(kind,[-3.75+v*.08*bp,5.25-i*1.42,0])
            if bp>0:txt(dd,ex+29,ey-30,str(round(v*bp))+'%',44,'#ff6386' if i==3 else '#f6f7ff')
            layer.alpha_composite(fade(item,ease((t-.5-i*.28)/.4)))
        end=Image.new('RGBA',layer.size);ed=ImageDraw.Draw(end);txt(ed,85,1668,'ΤΑΞΙΝΟΜΗΣΗ ΑΠΟ ΤΟ ΥΨΗΛΟΤΕΡΟ',27,'#a7b3cf',False)
        layer.alpha_composite(fade(end,ease((t-4.3)/.5)))
    elif kind==3:
        flag(d,3,900,620)
        end=Image.new('RGBA',layer.size);ed=ImageDraw.Draw(end)
        ed.rounded_rectangle((86,1532,101,1570),radius=4,fill='#ff315c')
        txt(ed,122,1523,'7 ΣΤΟΥΣ 10',43)
        ed.rounded_rectangle((598,1532,613,1570),radius=4,fill='#8fa4c7')
        txt(ed,634,1523,'3 ΣΤΟΥΣ 10',43)
        txt(ed,86,1641,'ΚΑΘΕ ΦΙΓΟΥΡΑ ΑΝΤΙΣΤΟΙΧΕΙ ΣΕ 10%',30,'#b1bed7',False)
        layer.alpha_composite(fade(end,ease((t-4.1)/.5)))
    elif kind==4:
        a=project(kind,[-3.15,0,0]);b=project(kind,[3.15,0,0]);d.line((a,b),fill='#617596',width=2)
        for i,v in enumerate([40,65]):
            bp=ease((t-.9-i*.55)/2.2);x=-1.9 if i==0 else 1.9
            px,py=project(kind,[x,v*.075*bp,0])
            item=Image.new('RGBA',layer.size);dd=ImageDraw.Draw(item)
            if bp>.001:txt(dd,px,py-125,str(round(v*bp))+'%',70,center=True)
            lx,ly=project(kind,[x,0,0])
            txt(dd,lx,1544,str(2015 if i==0 else 2025),55,center=True)
            txt(dd,lx,1625,'ΠΡΙΝ' if i==0 else 'ΜΕΤΑ',32,'#b1bed7',center=True)
            layer.alpha_composite(fade(item,ease((t-.45-i*.2)/.45)))
    elif kind==5:
        for row,share in enumerate([70,55]):
            bp=ease((t-.9-row*.5)/2.4);y=4.70-row*2.50
            _,cy=project(kind,[-3.5,y,0])
            item=Image.new('RGBA',layer.size);dd=ImageDraw.Draw(item)
            flag(dd,3 if row==0 else 4,139,cy-109)
            txt(dd,184,cy-133,'ΕΛΛΑΔΑ' if row==0 else 'ΕΥΡΩΠΑΪΚΗ ΕΝΩΣΗ',36)
            layer.alpha_composite(fade(item,ease((t-.4-row*.5)/.4)))
            labels=Image.new('RGBA',layer.size);ld=ImageDraw.Draw(labels)
            sx,sy=project(kind,[-3.5+7*share/100/2,y,0]);nx,ny=project(kind,[-3.5+7*share/100+7*(1-share/100)/2,y,0])
            txt(ld,sx,sy-26,'ΝΑΙ '+str(share)+'%',32,'#101b3b',center=True)
            txt(ld,nx,ny-26,'ΟΧΙ '+str(100-share)+'%',32,'#101b3b',center=True)
            layer.alpha_composite(fade(labels,ease((t-3.25-row*.5)/.4)))
        end=Image.new('RGBA',layer.size);ed=ImageDraw.Draw(end)
        txt(ed,85,1575,'ΚΑΘΕ ΜΠΑΡΑ = 100%',43)
        txt(ed,85,1668,'ΣΥΓΚΡΙΝΟΥΜΕ ΤΗΝ ΚΑΤΑΝΟΜΗ',30,'#b1bed7',False)
        layer.alpha_composite(fade(end,ease((t-4.1)/.5)))
    return layer

def make_frame(kind,t,lastgeom=None):
        p=ease((t-.9)/3.6)
        if lastgeom is None or t<4.6:
            native(pixels.ctypes.data,G,G,kind,t)
            arr=pixels.copy()
            if kind==0:
                yy=np.arange(G)*1080/G;fadecurve=np.clip((yy-110)/150,0,1)*np.clip((1040-yy)/230,0,1)
                arr[:,:,3]=(arr[:,:,3]*fadecurve[:,None]).astype('uint8')
            lastgeom=Image.fromarray(arr).resize((1080,1080),Image.Resampling.LANCZOS)
        content=Image.new('RGBA',(1080,1920));content.alpha_composite(lastgeom,(0,650))
        conf=list(configs[kind])
        if kind==0:conf[4]=str(round(38*clamp(p/.38)))+'%'
        elif kind==1:conf[4]='+'+str(round(32*p))
        elif kind==3:conf[4]=str(sum(t>=1.3+i*.4+.20 for i in range(7))*10)+'%'
        elif kind==4:conf[4]='+'+str(round(25*ease((t-3.65)/.8)))
        header=Image.new('RGBA',(1080,1920));rv.overlay(header,*configs[kind],source_text=source_text(kind))
        if kind in [0,1,3,4]:
            hd=ImageDraw.Draw(header)
            hero_width=hd.textlength(configs[kind][4],font=font(158))
            hd.rectangle((77,534,79+hero_width,740),fill=(0,0,0,0))
            txt(hd,78,535,conf[4],158)
        # Soft title entry; every animation uses the same frame clock.
        content.alpha_composite(fade(header,ease((t-.12)/.65)),(0,round(18*(1-ease((t-.12)/.65)))))
        content.alpha_composite(annotations(kind,t,p))
        opacity=ease(t/.28)*(1-ease((t-7.6)/.4))
        im=background.copy();im.alpha_composite(fade(content,opacity))
        return im.convert('RGB'),lastgeom

def main():
    global G,pixels
    parser=argparse.ArgumentParser();parser.add_argument('--stills',action='store_true');parser.add_argument('--only-new',action='store_true');args=parser.parse_args()
    order=[3,4,5] if args.only_new else [3,4,5,0,1,2]
    if args.stills:
        G=900;pixels=np.zeros((G,G,4),dtype=np.uint8)
        for kind in order:
            im,_=make_frame(kind,6.)
            im.save(ROOT+'/data-story-3d-'+names[kind]+'.png');print('STILL '+names[kind],flush=True)
        return
    filename='data-story-3d-new-types.mp4' if args.only_new else 'data-story-3d-animation-test.mp4'
    out=ROOT+'/'+filename
    ff=subprocess.Popen(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-threads','2','-preset','fast','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',out],stdin=subprocess.PIPE)
    start=time.time()
    for count,kind in enumerate(order):
        lastgeom=None
        for frame in range(SECONDS*FPS):
            im,lastgeom=make_frame(kind,frame/FPS,lastgeom)
            im=im.resize((W,H),Image.Resampling.LANCZOS)
            if frame in [38,75,125,175]:im.save(ROOT+f'/qa-motion-{kind}-{frame}.png')
            ff.stdin.write(im.tobytes())
            if frame%50==0:print(f'Scene {count+1}/{len(order)} · frame {frame}/200 · {time.time()-start:.1f}s',flush=True)
    ff.stdin.close();code=ff.wait()
    if code:raise RuntimeError('FFmpeg failed')
    print('DONE '+out,flush=True)

if __name__=='__main__':main()
