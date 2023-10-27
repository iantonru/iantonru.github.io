String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
  }

function show() {

    let xhr= new XMLHttpRequest();

    xhr.onreadystatechange= function() {
        if (this.readyState!==4) return;
        if (this.status!==200) return; 
        document.getElementById("form-link").innerHTML= this.responseText;
        form.onsubmit = (e) => {
            e.preventDefault();
            if(isLoading) return;
            let isValid = validateForm(form);
            let body = new FormData(form);
            body.set("user", new Blob([JSON.stringify({
                chain: window.chain,
                lastName : body.get("lastName"),
                firstName : body.get("firstName"),
                middleName :  body.get("middleName"),
                email : body.get("email"),
                phoneNumber : getPureNumber(body.get("phoneNumber"))
            })], {
                type: "application/json"
            }) )
            body.delete("lastName");
            body.delete("firstName");
            body.delete("middleName");
            body.delete("email");
            body.delete("phoneNumber");
            body.delete("checkbox");
        
            if(isValid){
                openLoaderAndLockButtons();
                fetch('https://promo-bk.tr-portal.ru/receipt/save', {
      
                        method: 'POST',
                        body: body})
                .then(function(response) {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response;
                }).then( function(response) {
                    closeLoaderAndUnlockButtons();
                       response.json().then((result)=>{
                        if(result.status==1){
                            showSuccess("formContainer");
                          }
                          else{
                            if(result.status==4){
                                showError("formContainer","Чек не распознан. Переснимите чек или обратитесь в службу поддержки.")
                            }else showError("formContainer", result.message);
                        }
                       })

                }).catch(function(error) {
                    closeLoaderAndUnlockButtons();
                    showError("formContainer");
                });
            }
          };

          formFeedBack.onsubmit = (e) => {
            e.preventDefault();
            if(isLoading) return;
            let isValid = validateForm(formFeedBack);
            let formData = new FormData(formFeedBack);

             let  body = JSON.stringify( Object.fromEntries(formData.entries()))

            
        
            if(isValid){
                openLoaderAndLockButtons();
                // const request = new XMLHttpRequest();

                // request.open("POST", "https://promo-bk.tr-portal.ru/receipt/feedback");
                // // request.setRequestHeader("Content-Type ",'multipart/form-data')
                // request.send(body);
                // request.onload = function () {
                //    closeLoaderAndUnlockButtons();
                //    if(request.status == 200) 
                //    showSuccess("form-container__FeedBack");
                // }

                // xhr.onerror = function() {
                //     closeLoaderAndUnlockButtons();
                //     showError("form-container__FeedBack");
                // };
                  

                fetch('https://promo-bk.tr-portal.ru/receipt/feedback', {
                    headers: {
                        'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                        'Content-Type': 'application/json'
                        
                      },
                        method: 'POST',
                        body: body})
                .then(function(response) {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response;
                }).then( function(response) {
                    closeLoaderAndUnlockButtons();
                    showSuccess("form-container__FeedBack");

                }).catch(function(error) {
                    closeLoaderAndUnlockButtons();
                    showError("form-container__FeedBack");
                });


            }
          };



        getMask();
    };
    xhr.send();
};

let isLoading= false;
show();

function openLoaderAndLockButtons(loaderId){
    document.getElementById("loader").style.display = "inline";
    document.getElementById("loader-feedBack").style.display = "inline";
    isLoading = true;
}

function closeLoaderAndUnlockButtons(loaderId){
    document.getElementById("loader-feedBack").style.display = "none";
    document.getElementById("loader").style.display = "none";
    isLoading =false;
}

function showChanged(){
    document.getElementById("fileInput").classList.add("ch_field-changed");
    document.getElementById("fileInput").classList.remove("ch_field-valid");
    document.getElementById("fileInput").classList.remove("ch_field-invalid");
    document.getElementById("fileInput").classList.remove("ch_field-invalid-wrong-type");
}

function showChangedCheckbox(){
    document.getElementById("checkbox-check").classList.add("ch_field-changed");
    document.getElementById("checkbox-check").classList.remove("ch_field-valid");
    document.getElementById("checkbox-check").classList.remove("ch_field-invalid");
    document.getElementById("checkbox-check").classList.remove("ch_field-invalid-wrong-type");
}

function showExample(){
    formContainer.style.display = "none";
    example.style.display = "block";
}

function closeExample(){
    formContainer.style.display = "block";
    example.style.display = "none";
}
    

function showError(formId, msg){
    if(msg){
        formStatusText.innerHTML = ucFirst(msg);
    }
    document.getElementById(formId).classList.add("form-container__error");
    function ucFirst(str) {
        if (!str) return str;
        return str[0].toUpperCase() + str.slice(1);
    }
}

function showSuccess(formId){
    document.getElementById(formId).classList.add("form-container__succses");

}

function closeStatus(formId, succsess){
  
    document.getElementById(formId).classList.remove("form-container__error");
    document.getElementById(formId).classList.remove("form-container__succses");
    if(succsess){
        cleanForm();
        closeForm();
    }
}


function onStoreChange(chain){
    window.chain = chain;
    stepToForm()
}

function stepToForm(){
    document.getElementById("back-button").classList.add("display_inline");
    document.getElementById("stores").classList.add("display_none");
    document.getElementById("form").classList.remove("display_none");
}

function stepBack(){
    window.storeCode = null;
    document.getElementById("back-button").classList.remove("display_inline");
    document.getElementById("stores").classList.remove("display_none");
    document.getElementById("form").classList.add("display_none");
}




function cleanForm(){
    form.reset();
    document.getElementsByTagName("input")[5].closest(".ch_field").classList.remove("ch_field-changed");
    document.getElementsByTagName("input")[4].value ='+7(___) __-__-___';
}

function getMask() {
    MaskedInput({
        elm: document.getElementById('phoneNumber'), // select only by id
        format: '+7(___) __-__-___',
        separator: '+7(   )-'
     });
}

function openForm(){
    document.getElementById("check-form").style.display ="flex";
    document.getElementById("check-form").classList.remove("form-window-container__FeedBack") 
}

function openFormFeedBack(){
    document.getElementById("check-form").classList.add("form-window-container__FeedBack");
    document.getElementById("check-form").style.display ="flex";
}

function closeForm(){
    if(isLoading) return;
    document.getElementById("check-form").style.display ="none";
    Array.from(document.getElementsByTagName("input")).forEach((input)=>{
        input.closest(".ch_field").classList.remove("ch_field-valid");
        input.closest(".ch_field").classList.remove("ch_field-invalid");
        input.closest(".ch_field").classList.remove("ch_field-invalid-wrong-type");
        input.closest(".ch_field").classList.remove("ch_field-invalid-wrong-size");
    }) 
}

function lunchValidation(form){

    // console.log("lunchValidation", form)
    validateForm(form)
}


function validateForm(form){
    let isValid = []
    let inputs = form.getElementsByTagName('input');
    Array.from(inputs).forEach((item)=>{
        isValid.push(validateInput(item));
    })
    return isValid.every(item=>item);
}

function validateInput(input){
    let isValid;
    isValid = input.validity.valid;
    // console.log("validateInput", input.id)
    if(input.id ==="phoneNumber"){

        let value = getPureNumber(input.value);
        // console.log("validateInput", value)
        isValid = value.length == 10;
    }
    if(input.id ==="receipt"){
        if(input.files.length){
            let isWrongType,isWrongSize;
            isWrongType =  input.files[0].type.indexOf("image") == -1 && input.files[0].type.indexOf("pdf") == -1;

            isWrongSize =input.files[0].size/1000000 >=25

            if(isWrongType) {
                isValid = false;
                input.closest(".ch_field").classList.add("ch_field-invalid");
                input.closest(".ch_field").classList.add("ch_field-invalid-wrong-type");
            }
            if(isWrongSize) {
                isValid = false;
                input.closest(".ch_field").classList.add("ch_field-invalid");
                input.closest(".ch_field").classList.add("ch_field-invalid-wrong-size");
            }

            
        }else {
            isValid =false;
            input.closest(".ch_field").classList.add("ch_field-invalid");
        }
    }
    if(input.id ==="email"){
        isValid =validateEmail(input.value);
    }
    if(input.id != "receipt" && input.id != "confirm" && input.id !="phoneNumber" && input.id !="email"){
        isValid = input.validity.valid && input.value.replace(/\s+/g, '').length;
    }
    

    if(isValid){
        input.closest(".ch_field").classList.remove("ch_field-invalid");
        input.closest(".ch_field").classList.remove("ch_field-invalid-wrong-type");
        input.closest(".ch_field").classList.remove("ch_field-invalid-wrong-size");
        input.closest(".ch_field").classList.add("ch_field-valid");
    }else{
        input.closest(".ch_field").classList.remove("ch_field-valid");
        input.closest(".ch_field").classList.remove("ch_field-changed");
        if(input.id ==="receipt") return isValid;
        input.closest(".ch_field").classList.add("ch_field-invalid");
    }
    return isValid
}

function  validateEmail(email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

function getPureNumber(str){
    str = str.replace("+7", "");
    str = str.replace(/[\D]+/g, '');
    
    return str;
  }


 
 
 
 // masked_input_1.4-min.js
 // angelwatt.com/coding/masked_input.php
 (function(a){a.MaskedInput=function(f){if(!f||!f.elm||!f.format){return null}if(!(this instanceof a.MaskedInput)){return new a.MaskedInput(f)}var o=this,d=f.elm,s=f.format,i=f.allowed||"0123456789",h=f.allowedfx||function(){return true},p=f.separator||"/:-",n=f.typeon||"_YMDhms",c=f.onbadkey||function(){},q=f.onfilled||function(){},w=f.badkeywait||0,A=f.hasOwnProperty("preserve")?!!f.preserve:true,l=true,y=false,t=s,j=(function(){if(window.addEventListener){return function(E,C,D,B){E.addEventListener(C,D,(B===undefined)?false:B)}}if(window.attachEvent){return function(D,B,C){D.attachEvent("on"+B,C)}}return function(D,B,C){D["on"+B]=C}}()),u=function(){for(var B=d.value.length-1;B>=0;B--){for(var D=0,C=n.length;D<C;D++){if(d.value[B]===n[D]){return false}}}return true},x=function(C){try{C.focus();if(C.selectionStart>=0){return C.selectionStart}if(document.selection){var B=document.selection.createRange();return -B.moveStart("character",-C.value.length)}return -1}catch(D){return -1}},b=function(C,E){try{if(C.selectionStart){C.focus();C.setSelectionRange(E,E)}else{if(C.createTextRange){var B=C.createTextRange();B.move("character",E);B.select()}}}catch(D){return false}return true},m=function(D){D=D||window.event;var C="",E=D.which,B=D.type;if(E===undefined||E===null){E=D.keyCode}if(E===undefined||E===null){return""}switch(E){case 8:C="bksp";break;case 46:C=(B==="keydown")?"del":".";break;case 16:C="shift";break;case 0:case 9:case 13:C="etc";break;case 37:case 38:case 39:case 40:C=(!D.shiftKey&&(D.charCode!==39&&D.charCode!==undefined))?"etc":String.fromCharCode(E);break;default:C=String.fromCharCode(E);break}return C},v=function(B,C){if(B.preventDefault){B.preventDefault()}B.returnValue=C||false},k=function(B){var D=x(d),F=d.value,E="",C=true;switch(C){case (i.indexOf(B)!==-1):D=D+1;if(D>s.length){return false}while(p.indexOf(F.charAt(D-1))!==-1&&D<=s.length){D=D+1}if(!h(B,D)){c(B);return false}E=F.substr(0,D-1)+B+F.substr(D);if(i.indexOf(F.charAt(D))===-1&&n.indexOf(F.charAt(D))===-1){D=D+1}break;case (B==="bksp"):D=D-1;if(D<0){return false}while(i.indexOf(F.charAt(D))===-1&&n.indexOf(F.charAt(D))===-1&&D>1){D=D-1}E=F.substr(0,D)+s.substr(D,1)+F.substr(D+1);break;case (B==="del"):if(D>=F.length){return false}while(p.indexOf(F.charAt(D))!==-1&&F.charAt(D)!==""){D=D+1}E=F.substr(0,D)+s.substr(D,1)+F.substr(D+1);D=D+1;break;case (B==="etc"):return true;default:return false}d.value="";d.value=E;b(d,D);return false},g=function(B){if(i.indexOf(B)===-1&&B!=="bksp"&&B!=="del"&&B!=="etc"){var C=x(d);y=true;c(B);setTimeout(function(){y=false;b(d,C)},w);return false}return true},z=function(C){if(!l){return true}C=C||event;if(y){v(C);return false}var B=m(C);if((C.metaKey||C.ctrlKey)&&(B==="X"||B==="V")){v(C);return false}if(C.metaKey||C.ctrlKey){return true}if(d.value===""){d.value=s;b(d,0)}if(B==="bksp"||B==="del"){k(B);v(C);return false}return true},e=function(C){if(!l){return true}C=C||event;if(y){v(C);return false}var B=m(C);if(B==="etc"||C.metaKey||C.ctrlKey||C.altKey){return true}if(B!=="bksp"&&B!=="del"&&B!=="shift"){if(!g(B)){v(C);return false}if(k(B)){if(u()){q()}v(C,true);return true}if(u()){q()}v(C);return false}return false},r=function(){if(!d.tagName||(d.tagName.toUpperCase()!=="INPUT"&&d.tagName.toUpperCase()!=="TEXTAREA")){return null}if(!A||d.value===""){d.value=s}j(d,"keydown",function(B){z(B)});j(d,"keypress",function(B){e(B)});j(d,"focus",function(){t=d.value});j(d,"blur",function(){if(d.value!==t&&d.onchange){d.onchange()}});return o};o.resetField=function(){d.value=s};o.setAllowed=function(B){i=B;o.resetField()};o.setFormat=function(B){s=B;o.resetField()};o.setSeparator=function(B){p=B;o.resetField()};o.setTypeon=function(B){n=B;o.resetField()};o.setEnabled=function(B){l=B};return r()}}(window));

 // Credits: http://blog.vishalon.net/index.php/javascript-getting-and-setting-caret-position-in-textarea/
function setCaretPosition(ctrl, pos) {
    pos =getPos(ctrl);
    setTimeout(function(){
    // Modern browsers
    if (ctrl.setSelectionRange) {
      ctrl.setSelectionRange(pos, pos);
    
    // IE8 and below
    } else if (ctrl.createTextRange) {
      var range = ctrl.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
    },100)

  }


  function getPos(input){

    let length = getPureNumber(input.value).length;
    if(length<=3){
        return length + 3;
    }
    if(length<=5){
        return length + 5
    }
    if(length<=7){
        return length + 6
    }
   
    return length + 7

  }


  /* ------------------------------- победители ------------------------------- */

  function renderPages(){
    for (let i=2;i<= Math.ceil( winnersData.length/10); i++){
        let page = document.createElement("div");
        page.innerHTML = i;
        page.classList.add("page")
        document.getElementById("pages").appendChild(page)
    }
  }


  let winners=[];
  
  let page = 1;




   winnersData = winnersData.map((winner)=>{
    winner.fullName = winner.LastName + " " + winner.FirstName[0] + ". " + winner.MiddleName[0] + "."
    return winner
   })

   winnersData.sort((a,b)=>{
    // if(a.data)
   })

   
   
  function getWinners(page){
    return winnersData.slice(0 + (page-1)*10, 0 + (page-1)*10+10);
  };



  function fillWinners(){

    fillWinnersDesktop();
    fillWinnersMobile();

    function fillWinnersDesktop(){
        let trs = Array.from(tableDesktop.getElementsByClassName("tr-item"))
        trs.forEach((tr,i,arr)=>{
            if(winners.length<=i) {
                tr.style.display = "none"
                return
            }
            tr.style.display = "table-row"
        
            
            tds=Array.from(tr.getElementsByTagName("td"))
            tds[0].innerHTML = winners[i].data
            tds[1].innerHTML = winners[i].fullName
            tds[2].innerHTML = winners[i].Id
            tds[3].innerHTML = transformPhone(winners[i].PhoneNumber)  
            tds[4].innerHTML =transformEmail( winners[i].Email )
            tds[5].innerHTML = winners[i].prize
        })
      }
    
      function fillWinnersMobile(){
        let trs = Array.from(tableMobile.getElementsByClassName("table-mobile"))

        
        trs.forEach((tr,i,arr)=>{
            if(winners.length<=i) {
                tr.style.display = "none"
                return
            }
            tr.style.display = "block"
        

            tds=Array.from(tr.getElementsByClassName("td-text"))
            tds[0].innerHTML = winners[i].data
            tds[1].innerHTML = winners[i].fullName
            tds[2].innerHTML = winners[i].Id
            tds[3].innerHTML = transformPhone(winners[i].PhoneNumber)
            tds[4].innerHTML = transformEmail(winners[i].Email)
            tds[5].innerHTML = winners[i].prize
        })
      }

    //   displayEx(){


    //   }
  }


  function transformPhone(data){
    data =""+data
    return "" + data[0] +data[1] +data[2] +"*****" +data[data.length-2] +data[data.length-1] 
}

function transformEmail(data){
    data =""+data
    return "" + data[0] +data[1] +data[2] +"***" + data.slice(data.indexOf("@"))
}


  function onPageChange(page, event){
    // console.log("onPageChange", event.target)
    page = page
    winners = getWinners(page)
    fillWinners()
  }
  winners = getWinners(1)
  fillWinners()

  renderPages();

  Array.from(document.getElementsByClassName('page')).forEach((item,i)=>{
    item.addEventListener("click",function(event){
        // console.log("click",event)
        page = event.target;
        Array.from (document.getElementsByClassName('page')).forEach((item)=>item.classList.remove("page-selected"))
        page.classList.add("page-selected")
        winners = getWinners(+page.getInnerHTML())
        fillWinners()
    })
       
  
  })
 