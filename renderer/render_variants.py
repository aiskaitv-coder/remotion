import os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT=os.path.dirname(os.path.abspath(__file__))
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
COLORS=np.array([[.022,.085,.85],[.86,.008,.075],[.28,.035,.72],[.08,.16,.32],[.016,.025,.054]],np.float32)

def rounded(p,c,b,r=.09):
    q=np.abs(p-np.array(c))-np.array(b)+r
    return np.linalg.norm(np.maximum(q,0),axis=-1)+np.minimum(np.max(q,axis=-1),0)-r

def make_scene(kind):
    def scene(p):
        if kind=='donut':
            radial=np.sqrt(p[...,0]**2+p[...,2]**2)
            q=np.stack([np.abs(radial-2.7)-.67,np.abs(p[...,1]-.58)-.48],-1)
            dist=np.linalg.norm(np.maximum(q+.10,0),axis=-1)+np.minimum(np.max(q+.10,axis=-1),0)-.10
            a=(np.arctan2(p[...,2],p[...,0])+.7)%(2*np.pi)
            # Equal radius: angle is strictly proportional to each share.
            cuts=np.array([0,.38,.62,.80,1])*2*np.pi
            index=np.select([a<cuts[1],a<cuts[2],a<cuts[3]],[1,0,2],default=3)
            edge=np.minimum.reduce([np.abs(np.sin(a-c))*radial for c in cuts[:-1]])
            # Subtle groove delineates segments, avoiding large missing angles.
            oncut=np.minimum.reduce([np.abs((a-c+np.pi)%(2*np.pi)-np.pi) for c in cuts[:-1]])<.003
            dist=np.where(oncut,np.maximum(dist,.004),dist)
        elif kind=='line':
            values=[42,48,55,66,74]
            nodes=np.array([[-3.45+i*1.725,v*.064,0] for i,v in enumerate(values)])
            ds=[]; ids=[]
            for i in range(4):
                a=nodes[i];b=nodes[i+1];v=b-a
                t=np.clip(np.sum((p-a)*v,-1)/np.dot(v,v),0,1)
                ds.append(np.linalg.norm(p-a-t[...,None]*v,axis=-1)-.078);ids.append(0)
            for i,c in enumerate(nodes):
                ds.append(np.linalg.norm(p-c,axis=-1)-(.17 if i==4 else .13));ids.append(1 if i==4 else 0)
            stack=np.stack(ds,-1);di=np.argmin(stack,-1)
            dist=np.min(stack,-1);index=np.array(ids)[di]
        else:
            values=[82,71,64,48]
            ds=[]
            for i,v in enumerate(values):
                length=v*.080
                ds.append(rounded(p,[-3.75+length/2,5.25-i*1.42,0],[length/2,.225,.5],.09))
            stack=np.stack(ds,-1);di=np.argmin(stack,-1)
            dist=np.min(stack,-1);index=np.array([0,2,3,1])[di]
        ground=p[...,1]+.10
        isfloor=ground<dist
        return np.minimum(dist,ground),np.where(isfloor,4,index)
    return scene

def render(kind):
    scene=make_scene(kind)
    W,H=640,640
    if kind=='donut': eye=np.array([0,12,16.],np.float32);target=np.array([0,.3,0]);span=8.9
    else: eye=np.array([0,7,23.],np.float32);target=np.array([0,2.65,0]);span=9.4
    f=target-eye;f/=np.linalg.norm(f)
    r=np.cross(f,[0,1,0]);r/=np.linalg.norm(r);u=np.cross(r,f)
    y,x=np.mgrid[:H,:W].astype(np.float32)
    o=eye+(x[...,None]-W/2)*r*(span/W)-(y[...,None]-H/2)*u*(span/W)
    direction=np.broadcast_to(f,o.shape)
    def trace(o,d,steps=90):
        t=np.zeros(o.shape[:-1],np.float32);active=np.ones(t.shape,bool)
        for i in range(steps):
            dist,_=scene(o+d*t[...,None]);active&=(dist>.003)&(t<60)
            if not active.any():break
            t+=np.where(active,np.maximum(dist,.002),0)
        p=o+d*t[...,None];dist,idx=scene(p)
        return p,idx,(dist<.018)&(t<60)
    def normal(p):
        n=np.stack([scene(p+np.eye(3)[i]*.005)[0]-scene(p-np.eye(3)[i]*.005)[0] for i in range(3)],-1)
        return n/np.maximum(np.linalg.norm(n,axis=-1,keepdims=True),1e-8)
    def shade(p,n,idx,view):
        col=COLORS[idx]*.16
        for pos,power,lc in [([-5,11,9],1.35,[.62,.75,1]),([7,9,4],1.35,[1,.5,.6]),([0,10,-5],2,[.5,.55,1]),([-1,4,11],.65,[1,1,1])]:
            l=np.array(pos)-p;l/=np.maximum(np.linalg.norm(l,axis=-1,keepdims=True),1e-6)
            nd=np.maximum(np.sum(n*l,-1),0)
            half=l+view;half/=np.maximum(np.linalg.norm(half,axis=-1,keepdims=True),1e-6)
            sp=np.maximum(np.sum(n*half,-1),0)
            col+=power*np.array(lc)*(COLORS[idx]*nd[...,None]*.58+(sp**60)[...,None]*.72+(sp**12)[...,None]*.05)
        return col
    print(kind+': geometry',flush=True)
    p,idx,hit=trace(o,direction);n=normal(p);col=shade(p,n,idx,-direction)
    if kind=='donut':
        print(kind+': reflection',flush=True)
        rd=direction-2*np.sum(direction*n,-1)[...,None]*n
        rp,ri,rh=trace(p+n*.02,rd,48)
        rc=shade(rp,normal(rp),ri,-rd)
        ref=(idx==4)&rh&(ri<4)
        col=np.where(ref[...,None],col*.7+rc*.18,col)
        shadow=np.exp(-(p[...,0]**2+p[...,2]**2)/8)
        col*=np.where(idx==4,1-shadow*.55,1)[...,None]
    col=np.clip(col,0,1)**(1/2.2)
    alpha=np.where(hit,1.,0.)
    if kind!='donut':alpha=np.where(idx==4,0.,alpha)
    rgba=np.concatenate([col,alpha[...,None]],-1)
    img=Image.fromarray(np.uint8(np.clip(rgba,0,1)*255),'RGBA').resize((1080,1080),Image.Resampling.LANCZOS)
    def project(v):
        q=np.array(v)-eye
        return (540+np.dot(q,r)/span*1080,650+540-np.dot(q,u)/span*1080)
    return img,project

def base(num,title1,title2,subtitle,hero,herolabel,herosub):
    y,x=np.mgrid[:1920,:1080]
    bg=np.zeros((1920,1080,3))+[18,27,55]
    for cx,cy,sx,sy,color in [(100,1160,680,550,[14,25,66]),(1120,1280,640,760,[47,9,38]),(720,-120,600,600,[13,8,29])]:
        glow=np.exp(-((x-cx)/sx)**2-((y-cy)/sy)**2);bg+=glow[...,None]*color
    im=Image.fromarray(np.uint8(np.clip(bg,0,255))).convert('RGBA')
    return im

def overlay(im,num,title1,title2,subtitle,hero,herolabel,herosub,source_text=None):
    d=ImageDraw.Draw(im)
    def text(x,y,s,size=40,color='#f6f7ff',weight=True):
        d.text((x,y),s,font=ImageFont.truetype(BOLD if weight else FONT,size),fill=color)
    def center(x,y,s,size=40,color='#f6f7ff',weight=True):
        f=ImageFont.truetype(BOLD if weight else FONT,size);d.text((x-d.textlength(s,font=f)/2,y),s,font=f,fill=color)
    d.rounded_rectangle((82,111,96,137),radius=4,fill='#fa244e')
    text(115,105,'DATA STORY',29)
    d.line((82,167,998,167),fill='#354057',width=1)
    for y,s in [(212,title1),(324,title2)]:
        size=98
        while d.textlength(s,font=ImageFont.truetype(BOLD,size))>920:size-=1
        text(76,y,s,size)
    text(83,480,subtitle,27,'#a7b3cf',False)
    text(78,535,hero,158)
    hw=d.textlength(hero,font=ImageFont.truetype(BOLD,158))
    text(105+hw,593,herolabel,38)
    text(105+hw,649,herosub,25,'#a7b3cf',False)
    d.line((83,759,995,759),fill='#354057',width=1)
    d.line((82,1785,998,1785),fill='#354057',width=1)
    footer=source_text or 'ΠΗΓΗ: — · ΔΟΚΙΜΑΣΤΙΚΑ ΣΤΟΙΧΕΙΑ'
    # Never silently crop a source: wrap onto two reserved footer lines.
    words=footer.split();lines=[];line=''
    for word in words:
        trial=(line+' '+word).strip()
        if d.textlength(trial,font=ImageFont.truetype(FONT,23))>910:
            lines.append(line);line=word
        else:line=trial
    lines.append(line)
    if len(lines)>2:raise ValueError('Source footer exceeds two lines; use a shorter source title.')
    for i,line in enumerate(lines):text(83,1804+i*34,line,23,'#afbbd3',False)
    return d,text,center

def make(kind):
    configs={
      'donut':('02','ΠΟΥ ΠΑΝΕ','ΤΑ ΧΡΗΜΑΤΑ','ΚΑΤΑΝΟΜΗ ΔΑΠΑΝΩΝ','38%','ΣΤΕΓΑΣΗ','ΤΟ ΜΕΓΑΛΥΤΕΡΟ ΜΕΡΙΔΙΟ'),
      'line':('03','Η ΑΝΟΔΟΣ','ΣΕ ΜΙΑ ΓΡΑΜΜΗ','ΕΞΕΛΙΞΗ ΣΕ ΠΕΝΤΕ ΧΡΟΝΙΑ','+32','ΜΟΝΑΔΕΣ','ΑΠΟ ΤΟ 2021 ΣΤΟ 2025'),
      'ranking':('04','ΠΟΙΟΣ ΕΙΝΑΙ','ΜΠΡΟΣΤΑ','ΣΥΓΚΡΙΣΗ ΤΕΣΣΑΡΩΝ ΧΩΡΩΝ','4','ΧΩΡΕΣ','ΜΙΑ ΚΟΙΝΗ ΚΛΙΜΑΚΑ')}
    conf=configs[kind];im=base(*conf)
    img,project=render(kind)
    if kind=='donut':
        arr=np.array(img);fade=np.clip((np.arange(1080)-110)/150,0,1)*np.clip((1040-np.arange(1080))/230,0,1)
        arr[:,:,3]=(arr[:,:,3]*fade[:,None]).astype(np.uint8);img=Image.fromarray(arr)
    im.alpha_composite(img,(0,650))
    d,text,center=overlay(im,*conf)
    if kind=='donut':
        labels=[('ΣΤΕΓΑΣΗ','38%','#ff315c'),('ΤΡΟΦΙΜΑ','24%','#567bff'),('ΜΕΤΑΦΟΡΕΣ','18%','#9852ff'),('ΑΛΛΑ','20%','#7191b9')]
        for i,(name,val,color) in enumerate(labels):
            x=84+(i%2)*475;y=1506+(i//2)*111
            d.rounded_rectangle((x,y+9,x+12,y+38),radius=4,fill=color)
            text(x+30,y,name,27)
            text(x+30,y+39,val,39,color)
    elif kind=='line':
        # Grid is projected in the same plane and scale as the real 3D tube.
        grid=Image.new('RGBA',im.size);gd=ImageDraw.Draw(grid)
        for val in [0,40,80]:
            a=project([-3.45,val*.064,0]);b=project([3.45,val*.064,0]);gd.line((a,b),fill=(134,152,195,65),width=1)
        im.alpha_composite(grid)
        d=ImageDraw.Draw(im)
        for i,v in enumerate([42,48,55,66,74]):
            x,y=project([-3.45+i*1.725,v*.064,0])
            center(x,y-84,str(v)+'%',43,'#ff6386' if i==4 else '#f6f7ff')
            bx,by=project([-3.45+i*1.725,0,0])
            d.line((bx,by-10,bx,by+6),fill='#8698bd',width=2)
            center(bx,by+25,str(2021+i),35)
        text(85,1607,'42%  →  74%',53)
        text(85,1690,'ΣΤΑΘΕΡΑ ΑΝΟΔΙΚΗ ΠΟΡΕΙΑ',27,'#a7b3cf',False)
    else:
        names=['ΓΕΡΜΑΝΙΑ','ΓΑΛΛΙΑ','ΙΤΑΛΙΑ','ΕΛΛΑΔΑ'];vals=[82,71,64,48]
        for i,(name,v) in enumerate(zip(names,vals)):
            _,cy=project([-3.75,5.25-i*1.42,0])
            text(163,cy-94,name,33)
            ex,ey=project([-3.75+v*.080,5.25-i*1.42,0]);text(ex+29,ey-30,str(v)+'%',44,'#ff6386' if i==3 else '#f6f7ff')
            fx=124;fy=cy-75
            if i==0:
                for j,c in enumerate(['#161616','#d9283d','#ffc735']):d.rectangle((fx-22,fy-14+j*9,fx+22,fy-6+j*9),fill=c)
            elif i in [1,2]:
                colors=['#2359bb','#fff','#e73347'] if i==1 else ['#22a269','#fff','#e73347']
                for j,c in enumerate(colors):d.rectangle((fx-22+j*15,fy-14,fx-8+j*15,fy+13),fill=c)
            else:
                d.rectangle((fx-22,fy-14,fx+22,fy+13),fill='#fff')
                for j in range(0,9,2):d.rectangle((fx-22,fy-14+j*3,fx+22,fy-12+j*3),fill='#2469d7')
                d.rectangle((fx-22,fy-14,fx-8,fy),fill='#2469d7');d.rectangle((fx-16,fy-14,fx-14,fy),fill='#fff');d.rectangle((fx-22,fy-8,fx-8,fy-6),fill='#fff')
        text(85,1668,'ΤΑΞΙΝΟΜΗΣΗ ΑΠΟ ΤΟ ΥΨΗΛΟΤΕΡΟ',27,'#a7b3cf',False)
    im.convert('RGB').save(ROOT+'/data-story-3d-'+kind+'.png')
    print('Saved '+kind,flush=True)

if __name__=='__main__':
    make(sys.argv[1])
