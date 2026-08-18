import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { deflateSync } from 'node:zlib';
const W=1200,H=630;
const C={black:[23,23,23,255],black2:[39,39,39,255],cream:[245,242,235,255],white:[255,255,255,255],orange:[255,107,53,255],orange2:[255,138,92,255],muted:[174,167,159,255],gray:[112,106,100,255],tan:[232,197,143,255],green:[165,193,154,255],blue:[181,216,209,255]};
const RAW=`
A:01110/10001/10001/11111/10001/10001/10001
B:11110/10001/10001/11110/10001/10001/11110
C:01111/10000/10000/10000/10000/10000/01111
D:11110/10001/10001/10001/10001/10001/11110
E:11111/10000/10000/11110/10000/10000/11111
F:11111/10000/10000/11110/10000/10000/10000
G:01111/10000/10000/10111/10001/10001/01111
H:10001/10001/10001/11111/10001/10001/10001
I:11111/00100/00100/00100/00100/00100/11111
J:00111/00010/00010/00010/10010/10010/01100
K:10001/10010/10100/11000/10100/10010/10001
L:10000/10000/10000/10000/10000/10000/11111
M:10001/11011/10101/10101/10001/10001/10001
N:10001/11001/10101/10011/10001/10001/10001
O:01110/10001/10001/10001/10001/10001/01110
P:11110/10001/10001/11110/10000/10000/10000
Q:01110/10001/10001/10001/10101/10010/01101
R:11110/10001/10001/11110/10100/10010/10001
S:01111/10000/10000/01110/00001/00001/11110
T:11111/00100/00100/00100/00100/00100/00100
U:10001/10001/10001/10001/10001/10001/01110
V:10001/10001/10001/10001/10001/01010/00100
W:10001/10001/10001/10101/10101/10101/01010
X:10001/10001/01010/00100/01010/10001/10001
Y:10001/10001/01010/00100/00100/00100/00100
Z:11111/00001/00010/00100/01000/10000/11111
0:01110/10001/10011/10101/11001/10001/01110
1:00100/01100/00100/00100/00100/00100/01110
2:01110/10001/00001/00010/00100/01000/11111
3:11110/00001/00001/01110/00001/00001/11110
4:00010/00110/01010/10010/11111/00010/00010
5:11111/10000/10000/11110/00001/00001/11110
6:01110/10000/10000/11110/10001/10001/01110
7:11111/00001/00010/00100/01000/01000/01000
8:01110/10001/10001/01110/10001/10001/01110
9:01110/10001/10001/01111/00001/00001/01110
.:00000/00000/00000/00000/00000/00110/00110
-:00000/00000/00000/11111/00000/00000/00000
/:00001/00010/00010/00100/01000/01000/10000
$:00100/01111/10100/01110/00101/11110/00100
%:11001/11010/00100/01000/10110/00110/00000
+:00000/00100/00100/11111/00100/00100/00000
 :00000/00000/00000/00000/00000/00000/00000`;
const FONT=Object.fromEntries(RAW.trim().split('\n').map(line=>{const i=line.indexOf(':');return [line.slice(0,i),line.slice(i+1).split('/')]}));
const crcTable=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
function crc32(b){let c=0xffffffff;for(const x of b)c=crcTable[(c^x)&255]^(c>>>8);return(c^0xffffffff)>>>0}
function chunk(type,data){const name=Buffer.from(type),out=Buffer.alloc(12+data.length);out.writeUInt32BE(data.length,0);name.copy(out,4);data.copy(out,8);out.writeUInt32BE(crc32(Buffer.concat([name,data])),8+data.length);return out}
function png(w,h,rgba){const scan=Buffer.alloc((w*4+1)*h);for(let y=0;y<h;y++){const d=y*(w*4+1);scan[d]=0;rgba.copy(scan,d+1,y*w*4,(y+1)*w*4)}const hdr=Buffer.alloc(13);hdr.writeUInt32BE(w,0);hdr.writeUInt32BE(h,4);hdr[8]=8;hdr[9]=6;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',hdr),chunk('IDAT',deflateSync(scan,{level:9})),chunk('IEND',Buffer.alloc(0))])}
function canvas(bg){const d=Buffer.alloc(W*H*4);for(let i=0;i<W*H;i++){d[i*4]=bg[0];d[i*4+1]=bg[1];d[i*4+2]=bg[2];d[i*4+3]=255}return d}
function rect(d,x,y,w,h,c){for(let yy=Math.max(0,~~y);yy<Math.min(H,Math.ceil(y+h));yy++)for(let xx=Math.max(0,~~x);xx<Math.min(W,Math.ceil(x+w));xx++){const p=(yy*W+xx)*4;d[p]=c[0];d[p+1]=c[1];d[p+2]=c[2];d[p+3]=255}}
function circle(d,cx,cy,r,c){for(let y=cy-r;y<cy+r;y++)for(let x=cx-r;x<cx+r;x++)if((x-cx)**2+(y-cy)**2<=r*r)rect(d,x,y,1,1,c)}
const ascii=v=>v.normalize('NFD').replace(/\p{Diacritic}/gu,'').toUpperCase();
const textWidth=(v,s)=>[...ascii(v)].length*6*s;
function text(d,x,y,v,s,c){let cur=x;for(const ch of ascii(v)){const g=FONT[ch]||FONT[' '];for(let r=0;r<7;r++)for(let col=0;col<5;col++)if(g[r][col]==='1')rect(d,cur+col*s,y+r*s,s,s,c);cur+=6*s}}
function badge(d,x,y,v,fg,bg,s=3){const pad=16,w=textWidth(v,s)+pad*2;rect(d,x,y,w,7*s+20,bg);text(d,x+pad,y+10,v,s,fg);return w}
function phone(d,x,y){rect(d,x,y,270,500,C.black2);rect(d,x+12,y+12,246,476,C.cream);rect(d,x+30,y+34,58,58,C.orange);text(d,x+105,y+43,'TIENDA',3,C.black);text(d,x+105,y+72,'DEMO',2,C.gray);rect(d,x+30,y+120,210,165,C.black2);circle(d,x+135,y+202,60,C.tan);circle(d,x+135,y+202,48,[241,202,124,255]);for(const [dx,dy] of [[-25,-22],[22,-10],[-12,25],[30,30]])circle(d,x+135+dx,y+202+dy,10,[180,71,56,255]);text(d,x+35,y+315,'MUZZARELLA',3,C.black);text(d,x+35,y+350,'$12.000',3,C.gray);rect(d,x+30,y+410,210,50,C.orange);text(d,x+55,y+426,'PEDIR',3,C.white)}
function home(){const d=canvas(C.black);rect(d,780,0,420,H,[92,46,30,255]);text(d,65,52,'GATRIVI.COM',4,C.white);badge(d,65,105,'TIENDAS PARA NEGOCIOS',C.white,C.black2);text(d,65,205,'TU NEGOCIO ONLINE',7,C.white);text(d,65,280,'LISTO PARA VENDER',7,C.orange2);text(d,65,385,'CATALOGO + CARRITO + WHATSAPP',4,C.muted);let x=65;for(const b of ['SIN COMISION','CARGA INCLUIDA','MOBILE'])x+=badge(d,x,475,b,C.black,C.cream)+12;text(d,65,565,'ZENGASOFT.SHOP',3,C.gray);phone(d,860,60);return d}
function prices(){const d=canvas(C.cream);text(d,65,55,'GATRIVI.COM',4,C.black);text(d,65,120,'PLANES Y PRECIOS',8,C.black);text(d,65,205,'ELEGI CUANTO QUERES RESOLVER',3,C.gray);for(const [i,a] of [[0,[65,'BASICO','$400.000','CATALOGO']],[1,[430,'ESTANDAR','$325.000','PROMO']],[2,[795,'PREMIUM','$1.200.000','COMPLETO']]]){const[x,n,p,s]=a;rect(d,x,270,340,245,C.white);if(i===1){rect(d,x,270,340,5,C.orange);rect(d,x,510,340,5,C.orange);rect(d,x,270,5,245,C.orange);rect(d,x+335,270,5,245,C.orange)}text(d,x+25,300,n,3,i===1?C.orange:C.gray);text(d,x+25,355,p,6,C.black);text(d,x+25,435,s,3,C.gray)}badge(d,65,550,'SIN ABONO MENSUAL OBLIGATORIO',C.white,C.black);return d}
function offer(){const d=canvas(C.black);rect(d,770,0,430,H,C.orange);text(d,65,55,'GATRIVI.COM',4,C.white);badge(d,65,105,'PROMO LANZAMIENTO 50%',C.black,C.orange2);text(d,65,195,'TU NEGOCIO',8,C.white);text(d,65,275,'EN UN LINK',8,C.orange2);text(d,65,375,'$325.000',9,C.white);text(d,520,408,'$650.000',3,C.gray);text(d,65,490,'CATALOGO + CARRITO + WHATSAPP',3,C.muted);badge(d,65,540,'RESERVA CON $65.000',C.black,C.cream);text(d,830,85,'01',5,C.black);text(d,830,135,'MANDAS FOTOS',4,C.black);text(d,830,225,'02',5,C.black);text(d,830,275,'LO ARMAMOS',4,C.black);text(d,830,365,'03',5,C.black);text(d,830,415,'VENDES',4,C.black);badge(d,830,515,'SIN COMISION',C.white,C.black,4);return d}
function support(){const d=canvas(C.cream);text(d,65,55,'GATRIVI.COM',4,C.black);text(d,65,135,'SOPORTE Y CAMBIOS',7,C.black);text(d,65,220,'DESPUES DE PUBLICAR',3,C.orange);for(const [x,n,p] of [[65,'SIN ABONO','$0'],[430,'CUIDADO','$35.000'],[795,'PRIORIDAD','$60.000']]){rect(d,x,300,340,210,C.white);text(d,x+25,330,n,3,C.gray);text(d,x+25,390,p,5,C.black);text(d,x+25,455,'/ MES',2,C.gray)}badge(d,65,550,'EL SOPORTE ES OPCIONAL',C.white,C.black);return d}
function reserve(){const d=canvas(C.black);rect(d,790,0,410,H,C.orange);text(d,65,55,'GATRIVI.COM',4,C.white);text(d,65,155,'RESERVA TU',7,C.white);text(d,65,230,'PROYECTO',7,C.orange2);text(d,65,340,'$65.000',9,C.white);text(d,65,450,'SE DESCUENTA DEL TOTAL',3,C.muted);badge(d,65,520,'MERCADO PAGO + TRANSFERENCIA',C.black,C.cream);for(const [y,n,v] of [[120,'1','ELEGIS PLAN'],[245,'2','RESERVAS'],[370,'3','ARRANCAMOS']]){text(d,845,y,n,7,C.black);text(d,900,y+15,v,3,C.black)}return d}
function demos(){const d=canvas(C.black);text(d,65,55,'GATRIVI.COM',4,C.white);text(d,65,130,'MUESTRAS QUE',8,C.white);text(d,65,210,'SE PUEDEN PROBAR',8,C.orange2);text(d,65,310,'CATALOGO + PAGINA + TIENDA',4,C.muted);for(const [x,n,c] of [[65,'PANADERIA',C.tan],[390,'PIZZERIA',[216,107,70,255]],[715,'PET SHOP',C.green]]){rect(d,x,385,290,160,C.cream);rect(d,x+18,403,254,65,c);text(d,x+20,490,n,3,C.black);text(d,x+20,520,'DEMO NAVEGABLE',2,C.gray)}text(d,65,585,'ENTRA COMO CLIENTE. PROBALA.',3,C.gray);return d}
function namedDemo(name,rubro,accent){const d=canvas(C.black);rect(d,820,0,380,H,accent);text(d,65,55,'GATRIVI.COM',4,C.white);badge(d,65,110,'DEMO NAVEGABLE',C.black,C.cream);const w=name.split(' '),l1=w.length>2?w.slice(0,-1).join(' '):name,l2=w.length>2?w.at(-1):'';text(d,65,210,l1,7,C.white);if(l2)text(d,65,280,l2,7,C.orange2);text(d,65,l2?375:300,rubro,4,C.muted);text(d,65,500,'ABRILA. PROBALA COMO CLIENTE.',3,C.gray);phone(d,880,65);return d}
const cards=[['home.png',home()],['precios.png',prices()],['oferta.png',offer()],['demos.png',demos()],['soporte.png',support()],['reservar.png',reserve()],['demo-heladeria.png',namedDemo('HELADOS DEL BARRIO','HELADERIA',C.blue)],['demo-molino-florida.png',namedDemo('MOLINO FLORIDA','HARINAS + CEREALES',[214,181,108,255])],['demo-ferreteria.png',namedDemo('FERRETERIA NORTE','HERRAMIENTAS',[176,179,181,255])]];
const outDir=resolve('public/og');mkdirSync(outDir,{recursive:true});for(const [name,data] of cards)writeFileSync(resolve(outDir,name),png(W,H,data));console.log(`Generated ${cards.length} OG images in public/og`);
