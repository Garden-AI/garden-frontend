import{c as s,j as t,g as a,B as c,o as p}from"./index-DDiNzego.js";import{W as h}from"./WithTooltip-DzFoDp_W.js";/**
 * @license lucide-react v0.394.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=s("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.394.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=s("SquareFunction",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["path",{d:"M9 17c2 0 2.8-1 2.8-2.8V10c0-2 1-3.3 3.2-3",key:"m1af9g"}],["path",{d:"M9 11.2h5.7",key:"3zgcl2"}]]);function y({hint:o,content:e,className:r,icon:n}){return o===void 0?t.jsx(u,{className:a("border-none bg-transparent text-gray-700 transition-colors hover:bg-transparent hover:text-gray-500",r),content:e,children:t.jsx(i,{})}):t.jsx(h,{hint:o,className:r,children:t.jsx(c,{onClick:()=>{navigator.clipboard.writeText(e),p.success("Copied to clipboard!")},variant:"outline",size:"icon",className:a("border-none bg-transparent text-gray-700 transition-colors hover:bg-transparent hover:text-gray-500",r),children:n||t.jsx(i,{className:"h-8 w-8 p-1.5"})})})}const u=({className:o,children:e,content:r})=>t.jsx(c,{onClick:()=>{navigator.clipboard.writeText(r),p.success("Copied to clipboard!")},variant:"outline",size:"icon",className:a("h-8 w-8 p-1.5 transition-colors duration-200 ",o),children:e});export{y as C,l as S};
