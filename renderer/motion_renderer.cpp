#include <cmath>
#include <algorithm>
#include <cstdint>
using std::max;using std::min;
struct V {float x,y,z; V(float a=0,float b=0,float c=0):x(a),y(b),z(c){} V operator+(V b)const{return {x+b.x,y+b.y,z+b.z};} V operator-(V b)const{return {x-b.x,y-b.y,z-b.z};} V operator*(float f)const{return {x*f,y*f,z*f};} V operator/(float f)const{return *this*(1/f);} };
float dot(V a,V b){return a.x*b.x+a.y*b.y+a.z*b.z;} float len(V a){return sqrtf(dot(a,a));} V norm(V a){return a/max(len(a),1e-8f);} V cross(V a,V b){return {a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x};} V mul(V a,V b){return {a.x*b.x,a.y*b.y,a.z*b.z};}
float clamp(float f,float a=0,float b=1){return min(b,max(a,f));} float ease(float t){t=clamp(t);return 1-powf(1-t,3);}
struct S {float d;int id;};
float box(V p,V c,V b,float r){V q=p-c;q={fabsf(q.x)-b.x+r,fabsf(q.y)-b.y+r,fabsf(q.z)-b.z+r};return len({max(q.x,0.f),max(q.y,0.f),max(q.z,0.f)})+min(max(q.x,max(q.y,q.z)),0.f)-r;}
float capsule(V p,V a,V b,float r){V v=b-a;float t=clamp(dot(p-a,v)/max(dot(v,v),1e-9f));return len(p-a-v*t)-r;}
struct Scene {
 int kind;float prog;float time;float bar[4];
 S operator()(V p)const {
  S s={100,0};
  if(kind==0){
   if(prog>.0001f){
    float radial=sqrtf(p.x*p.x+p.z*p.z),qx=fabsf(radial-2.7f)-.57f,qy=fabsf(p.y-.58f)-.38f;
    float d=sqrtf(max(qx,0.f)*max(qx,0.f)+max(qy,0.f)*max(qy,0.f))+min(max(qx,qy),0.f)-.10f;
    float a=fmodf(atan2f(p.z,p.x)+.7f+6.2831853f,6.2831853f);
    if(prog<.9999f){
     float end=prog*6.2831853f;
     float ad=a>end?min(a-end,6.2831853f-a):-min(a,end-a);
     float cut=radial*sinf(clamp(fabsf(ad),0,1.5707963f))*(ad<0?-1.f:1.f);
     d=max(d,cut);
    }
    int id=a<2.38761f?1:(a<3.89557f?0:(a<5.02655f?2:3));s={d,id};
   }
  }else if(kind==1){
   float vals[5]={42,48,55,66,74};V nodes[5];for(int i=0;i<5;i++)nodes[i]={-3.45f+i*1.725f,vals[i]*.064f,0};
   if(prog>.0001f){
    for(int i=0;i<4;i++){float part=clamp(prog*4-i);if(part<=0)continue;float d=capsule(p,nodes[i],nodes[i]+(nodes[i+1]-nodes[i])*part,.078f);if(d<s.d)s={d,0};}
    for(int i=0;i<5;i++){if(prog*4+.001<i)continue;float d=len(p-nodes[i])-(i==4?.17f:.13f);if(d<s.d)s={d,i==4?1:0};}
   }
  }else if(kind==2){
   float values[4]={82,71,64,48};int ids[4]={0,2,3,1};
   for(int i=0;i<4;i++){if(bar[i]<.001f)continue;float l=values[i]*.080f*bar[i];float r=min(.09f,l*.3f);float d=box(p,{-3.75f+l/2,5.25f-i*1.42f,0},{l/2,.225f,.5f},r);if(d<s.d)s={d,ids[i]};}
  }else if(kind==3){
   for(int i=0;i<10;i++){
    V q=p-V(-3.16f+(i%5)*1.58f,i<5?3.15f:.55f,0);
    float bound=max(fabsf(q.x)-.56f,max(fabsf(q.y-.84f)-.85f,fabsf(q.z)-.21f));
    if(bound>s.d)continue;
    float d=len(q-V(0,1.48f,0))-.19f;
    d=min(d,box(q,{0,.87f,0},{.24f,.36f,.16f},.11f));
    d=min(d,capsule(q,{-.30f,1.10f,0},{-.43f,.57f,0},.105f));
    d=min(d,capsule(q,{.30f,1.10f,0},{.43f,.57f,0},.105f));
    d=min(d,capsule(q,{-.135f,.57f,0},{-.155f,.10f,0},.105f));
    d=min(d,capsule(q,{.135f,.57f,0},{.155f,.10f,0},.105f));
    if(d<s.d)s={d,10+i};
   }
  }else if(kind==4){
   float vals[2]={40,65};
   for(int i=0;i<2;i++){
    float bp=ease((time-.9f-i*.55f)/2.2f);if(bp<.002f)continue;
    float h=vals[i]*.075f*bp;
    V q=p-V(i==0?-1.9f:1.9f,h/2,0);
    q={q.x*.966f-q.z*.259f,q.y,q.x*.259f+q.z*.966f};
    float d=box(q,{0,0,0},{.78f,h/2,.64f},min(.105f,h*.3f));
    if(d<s.d)s={d,i==0?0:1};
   }
  }else if(kind==5){
   float vals[2]={.70f,.55f};
   for(int row=0;row<2;row++){
    float bp=ease((time-.9f-row*.5f)/2.4f);if(bp<.002f)continue;
    float len1=7.f*vals[row]*bp,len2=7.f*(1-vals[row])*bp;
    float y=4.70f-row*2.50f;
    float d=box(p,{-3.5f+len1/2,y,0},{len1/2,.40f,.50f},min(.09f,len1*.3f));
    if(d<s.d)s={d,row==0?1:0};
    d=box(p,{-3.5f+len1+len2/2,y,0},{len2/2,.40f,.50f},min(.09f,len2*.3f));
    if(d<s.d)s={d,3};
   }
  }
  if(kind==0&&p.y+.10f<s.d)s={p.y+.10f,4};return s;
 }
};
V normal(const Scene&s,V p){float e=.004f;return norm({s(p+V(e,0,0)).d-s(p-V(e,0,0)).d,s(p+V(0,e,0)).d-s(p-V(0,e,0)).d,s(p+V(0,0,e)).d-s(p-V(0,0,e)).d});}
V colors[5]={{.022f,.085f,.85f},{.86f,.008f,.075f},{.28f,.035f,.72f},{.08f,.16f,.32f},{.016f,.025f,.054f}};
V shade(V p,V n,int id,V view,const Scene&s){
 V material;
 if(id>=10){int figure=id-10;float selected=figure<7?ease((s.time-1.3f-figure*.4f)/.35f):0;material=V(.055f,.08f,.145f)*(1-selected)+colors[1]*selected;}
 else material=colors[id];
 V col=material*.16f;V poses[4]={{-5,11,9},{7,9,4},{0,10,-5},{-1,4,11}};float powers[4]={1.35f,1.35f,2.f,.65f};V lights[4]={{.62f,.75f,1},{1,.5f,.6f},{.5f,.55f,1},{1,1,1}};
 for(int i=0;i<4;i++){V l=norm(poses[i]-p);float nd=max(dot(n,l),0.f);float sp=max(dot(n,norm(l+view)),0.f);float spec=powf(sp,60)*.72f+powf(sp,12)*.05f;col=col+mul(lights[i],material*(nd*.58f)+V(spec,spec,spec))*powers[i];}return col;
}
bool trace(const Scene&s,V o,V d,V &p,int &id,int steps=85){float t=0;S h;for(int i=0;i<steps;i++){p=o+d*t;h=s(p);if(h.d<.003f){id=h.id;return true;}t+=max(h.d,.002f);if(t>60)return false;}p=o+d*t;h=s(p);id=h.id;return h.d<.016f;}
extern "C" void render(unsigned char*out,int w,int h,int kind,float time){
 Scene s;s.kind=kind;s.time=time;s.prog=ease((time-.9f)/3.6f);for(int i=0;i<4;i++)s.bar[i]=ease((time-.9f-i*.28f)/2.5f);
 V eye=kind==0?V(0,12,16):V(0,7,23);V target=kind==0?V(0,.3f,0):V(0,2.65f,0);float span=kind==0?8.9f:9.4f;V f=norm(target-eye),r=norm(cross(f,{0,1,0})),u=cross(r,f);
 #pragma omp parallel for schedule(dynamic,4) num_threads(4)
 for(int y=0;y<h;y++)for(int x=0;x<w;x++){
  V o=eye+r*((x-w/2.f)*span/w)-u*((y-h/2.f)*span/w),p;int id;bool hit=trace(s,o,f,p,id);V col;
  if(hit){V n=normal(s,p);col=shade(p,n,id,f*-1,s);
   if(kind==0&&id==4){V rd=f-n*(2*dot(f,n)),rp;int ri;if(trace(s,p+n*.02f,rd,rp,ri,45)&&ri<4){col=col*.7f+shade(rp,normal(s,rp),ri,rd*-1,s)*.18f;}float shadow=expf(-(p.x*p.x+p.z*p.z)/8);col=col*(1-shadow*.55f);}
  }
  int k=(y*w+x)*4;out[k]=(unsigned char)(powf(clamp(col.x),1/2.2f)*255);out[k+1]=(unsigned char)(powf(clamp(col.y),1/2.2f)*255);out[k+2]=(unsigned char)(powf(clamp(col.z),1/2.2f)*255);out[k+3]=hit?255:0;
 }
}
