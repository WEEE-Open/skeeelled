(this.webpackJsonpskeeelled=this.webpackJsonpskeeelled||[]).push([[0],{26:function(e,t,n){e.exports={container:"profile_container__2Cx3s",header:"profile_header__36Zhu",pagination:"profile_pagination__2N9Pb",innerHeader:"profile_innerHeader__3REzl"}},53:function(e,t,n){e.exports={container:"questions_container__3FAQr",header:"questions_header__3kLPy",pagination:"questions_pagination__HvQnc"}},54:function(e,t,n){e.exports={container:"answers_container__3brr9",header:"answers_header__2gpkG",collapse:"answers_collapse__1QLxR",pagination:"answers_pagination__9oRHe"}},55:function(e,t,n){e.exports={container:"myQuestions_container__CqibH",header:"myQuestions_header__3PPNR",pagination:"myQuestions_pagination__38t-i"}},56:function(e,t,n){e.exports={multipleChoice:"exam_multipleChoice__2xfH2"}},77:function(e,t,n){},79:function(e,t,n){},85:function(e,t,n){e.exports={navContainer:"navigationBar_navContainer__JkV07"}},97:function(e,t,n){"use strict";n.r(t);var c=n(1),a=n(17),r=n.n(a),s=n(20),i=(n(77),n(60)),o=n.n(i),l=n(66),j=n(6),d=(n(79),n(80),n(102)),u=n(101),b=n(68),h=n(99),x=n(105),O=n(103),p=n(100),f=n(0);var g=function(e){var t=Object(c.useState)(""),n=Object(j.a)(t,2),a=n[0],r=n[1],s=Object(c.useState)(""),i=Object(j.a)(s,2),o=i[0],l=i[1],d=Object(c.useState)(""),u=Object(j.a)(d,2),b=u[0],g=u[1];return Object(f.jsxs)(x.a.Dialog,{children:[Object(f.jsx)(x.a.Header,{children:Object(f.jsx)(x.a.Title,{children:"Login"})}),Object(f.jsxs)(x.a.Body,{children:[b?Object(f.jsx)(h.a,{variant:"danger",children:b}):null,Object(f.jsxs)(O.a.Group,{controlId:"username",children:[Object(f.jsx)(O.a.Label,{children:"Email"}),Object(f.jsx)(O.a.Control,{type:"email",value:a,onChange:function(e){return r(e.target.value)}})]}),Object(f.jsxs)(O.a.Group,{controlId:"password",children:[Object(f.jsx)(O.a.Label,{children:"Password"}),Object(f.jsx)(O.a.Control,{type:"password",value:o,onChange:function(e){return l(e.target.value)}})]})]}),Object(f.jsx)(x.a.Footer,{children:Object(f.jsx)(p.a,{onClick:function(t){t.preventDefault(),g("");var n={username:a,password:o},c=!0;""!==a&&function(e){return e.length>=6}(o)||(c=!1),c?e.login(n):g("Errors in the form")},children:"Login"})})]})},m=n(108),_=n(107),v=n(69),w=n(106),C=function(){return Object(f.jsx)(f.Fragment,{children:Object(f.jsx)(_.a,{children:Object(f.jsxs)(w.a,{variant:"flush",children:[Object(f.jsx)(w.a.Item,{children:"Cras justo odio"}),Object(f.jsx)(w.a.Item,{children:"Dapibus ac facilisis in"}),Object(f.jsx)(w.a.Item,{children:"Vestibulum at eros"})]})})})},y=n(104),k=Object(f.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:Object(f.jsx)("path",{d:"M10 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h4M16 17l5-5-5-5M19.8 12H9"})}),L=Object(f.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"24",fill:"currentColor",className:"bi bi-gear-fill",viewBox:"0 2 16 16",children:Object(f.jsx)("path",{d:"M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"})}),B=n.p+"static/media/logo.7e59273d.svg";n(85);var F=function(e){return Object(f.jsxs)(y.a,{bg:"light",variant:"light",children:[e.admin?Object(f.jsx)(s.b,{to:"/admin/list",children:Object(f.jsxs)(y.a.Brand,{children:[L," Admin panel"]})}):null,Object(f.jsx)(s.b,{to:"/",children:Object(f.jsx)(y.a.Brand,{children:Object(f.jsx)("img",{src:B})})}),e.logged?Object(f.jsxs)(f.Fragment,{children:[Object(f.jsx)(O.a,{className:"mx-auto w-25",children:Object(f.jsx)(O.a.Control,{type:"text",placeholder:"Search",onChange:function(){}})}),Object(f.jsx)(s.b,{to:"/",onClick:e.logout,children:Object(f.jsxs)(y.a.Brand,{children:["Logout ",k]})})]}):null]})};function N(){for(var e=[],t=1;t<=5;t++)e.push(Object(f.jsx)(m.a.Item,{active:1===t,activeLabel:"",children:t},t));return Object(f.jsxs)(m.a,{children:[Object(f.jsx)(m.a.First,{}),e,Object(f.jsx)(m.a.Last,{})]})}function H(e){var t=e.course;return Object(f.jsxs)("tr",{children:[Object(f.jsx)("td",{width:"1%",children:t.code}),Object(f.jsx)("td",{children:Object(f.jsx)(s.b,{to:"/course/"+t.code,children:t.name})}),Object(f.jsx)("td",{children:t.prof}),Object(f.jsxs)("td",{width:"1%",children:["(",t.cfu,")"]})]})}var S=function(){var e=Object(c.useState)([{code:"A0B1C2",name:"Analysis 1",cfu:10,prof:"Mario Rossi"},{code:"D3E4F5",name:"Physics 1",cfu:10,prof:"Stefano Bianchi"},{code:"G6H7I8",name:"Geometry",cfu:10,prof:"Giuseppe Verdi"}]),t=Object(j.a)(e,2),n=t[0];return t[1],Object(f.jsxs)(u.a,{children:[Object(f.jsx)(b.a,{children:Object(f.jsxs)(_.a,{body:!0,children:[Object(f.jsx)("h1",{children:"Available courses"}),Object(f.jsx)(v.a,{striped:!0,className:"my-5",children:Object(f.jsx)("tbody",{children:n.map((function(e,t){return Object(f.jsx)(H,{course:e},t)}))})}),Object(f.jsx)(N,{})]})}),Object(f.jsx)(b.a,{className:"d-none d-md-block col-md-4",children:Object(f.jsx)(C,{})})]})};n(53),n(71),n(54),n(26),n(55),n(2),n(3),n(61),n(56);var I=function(){var e=Object(c.useState)(!1),t=Object(j.a)(e,2),n=t[0],a=t[1],r=Object(c.useState)(!1),s=Object(j.a)(r,2),i=(s[0],s[1]),x=Object(c.useState)(""),O=Object(j.a)(x,2),p=O[0],m=O[1];Object(c.useEffect)((function(){n||m("")}),[n]);var _=function(){var e=Object(l.a)(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a(!1),i(!1);case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(f.jsxs)(d.a,{fluid:!0,children:[Object(f.jsx)(u.a,{children:Object(f.jsx)(b.a,{className:"px-0",children:Object(f.jsx)(F,{logged:n,logout:_,setlogged:a})})}),Object(f.jsx)(u.a,{className:"my-4",children:Object(f.jsx)(b.a,{xs:6,className:"mx-auto",children:p?Object(f.jsx)(h.a,{variant:p.type,onClose:function(){return m("")},dismissible:!p.noclose,children:p.msg}):null})}),Object(f.jsx)(u.a,{className:"my-4",children:Object(f.jsx)(b.a,{xs:10,md:8,className:"mx-auto",children:n?Object(f.jsx)(f.Fragment,{children:Object(f.jsx)(S,{})}):Object(f.jsx)(g,{login:function(){return a(!0)}})})})]})},P=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,109)).then((function(t){var n=t.getCLS,c=t.getFID,a=t.getFCP,r=t.getLCP,s=t.getTTFB;n(e),c(e),a(e),r(e),s(e)}))};r.a.render(Object(f.jsx)(s.a,{children:Object(f.jsx)(I,{})}),document.getElementById("root")),P()}},[[97,1,2]]]);
//# sourceMappingURL=main.41808acd.chunk.js.map