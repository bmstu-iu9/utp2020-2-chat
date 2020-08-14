"use strict"

const selectElement = document.querySelector("[data_select]");

selectElement.addEventListener("click", function(event) {
    if (event.target.hasAttribute("data_select_item")) {
        const itemTitle = event.target.getAttribute("data_select_item");
        console.log(itemTitle);
        event.target.closest("[data_select]").querySelector("[data_select_title]").textContent = itemTitle;
        event.target.closest("[data_select]").querySelector(".header_select_dropdown").classList.toggle("hidden");
    } else {
        this.querySelector(".header_select_dropdown").classList.toggle("hidden");
    }
})

var config = {
    apiKey: "AIzaSyC3IZYPlLM7MyK2eT4CWQm-lrgqiqTxmiQ",
    authDomain: "feedback-form-6fbbd.firebaseapp.com",
    databaseURL: "https://feedback-form-6fbbd.firebaseio.com",
    projectId: "feedback-form-6fbbd",
    storageBucket: "feedback-form-6fbbd.appspot.com",
    messagingSenderId: "708240577694",
    appId: "1:708240577694:web:69e46bef22623999ed178f",
    measurementId: "G-CGGRTB89WG"
};

firebase.initializeApp(config);

var messagesRef = firebase.database().ref('messages');

var feedback_form_el = document.getElementById('feedback_form');

if (feedback_form_el) {
    feedback_form_el.addEventListener('submit', submitForm);
}

let cart = new Map();

function submitForm(e) {
    if (cart.size == 0) {
        alert("Ваша корзина пуста. Перед отправкой заказа добавьте в корзину хотя бы один товар.");
        e.preventDefault();
    } else {
        alert("Ваша заявка отправлена.");

        e.preventDefault();

        var telephone = getInputVal('telephone');
        var address = getInputVal('address');
        var comment = getInputVal('comment');
        var contact_person = getInputVal('contact_person');
        var email = getInputVal('email');
        var delivery;
        var del1 = document.getElementById('del-1');
        var del2 = document.getElementById('del-2');
        var del3 = document.getElementById('del-3');
        var del4 = document.getElementById('del-4');
        var del5 = document.getElementById('del-5');

        if (del1.checked) delivery = "Самовывоз (г. Москва)";
        else if (del2.checked) delivery = "Доставка СДЭК";
        else if (del3.checked) delivery = "Доставка ЕМС";
        else if (del4.checked) delivery = "Доставка Почтой России";
        else delivery = "Доставка курьером (г. Москва)";

        saveMessage(telephone, address, comment, delivery, contact_person, email);
    }
}

function getInputVal(id) {
    return document.getElementById(id).value;
}

function saveMessage(telephone, address, comment, delivery, contact_person, email) {
    var newMessageRef = messagesRef.push();
    newMessageRef.set({
        telephone: telephone,
        address: address,
        comment: comment,
        delivery: delivery,
        contact_person: contact_person,
        email: email
    });
}

function isEmptyObject(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }
    return true;
}

function setAttributes(elem, obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
        elem[prop] = obj[prop];
    }
}

function createImageWithAttributes (attributesList){
    let keys = ['src', 'alt', 'height', 'width'];
    let obj = {};

    for (let i = 0; i < keys.length; i++) {
        obj[keys[i]] = attributesList[i];
    }

    let img = document.createElement("img");
    setAttributes(img,obj);

    return img;
}

function createElementWithAttributes (attributesList){
    let element = document.createElement(attributesList[0]);
    element.setAttribute("class", attributesList[1]);
    if (attributesList.length === 3)
        element.innerHTML = attributesList[2];

    return element;
}

function addOnePurchase (goodInformation) {
    let id = goodInformation["id"];
    let res = cart.get(id);
    if (res === undefined) {
        if (goodInformation["count_of_product"] > 0) {
            cart.set(id, {"count": 0,"object": goodInformation});
            plusFunction(id);
        }
        else alert ("Товара нет в наличии.");
    } else {
        plusFunction(id);
    }
}

function createItem(goodInformation){

    let goodAttribute = ["div", "product"]
    let good = createElementWithAttributes(goodAttribute);

    let innerElementsInformation = [
        ["div", "productImg"],
        ["div", "productName", goodInformation["name_of_product"]],
        ["div", "productState"],
        ["div", "productCost", goodInformation["price"] + " руб"],
        ["button", "addPurchase", "Добавить в корзину"],
    ]

    let goodInnerElements = [];

    for (let i = 0; i < innerElementsInformation.length; ++i){
        let elementAttribute = innerElementsInformation[i];
        let element = createElementWithAttributes(elementAttribute);
        goodInnerElements.push(element);
    }

    let photoAttribute = [goodInformation["url"], "product photo", "220",  "220"];
    let goodPhoto = createImageWithAttributes (photoAttribute);
    goodInnerElements[0].append(goodPhoto);

    let iconAttribute = ["div", "availabilityIcon"]
    let goodIcon = createElementWithAttributes(iconAttribute);

        let iconUrl;
        if (goodInformation["state"] == "В наличии")
        iconUrl = "img/icons/confirmation-icon.png";
        else
        iconUrl = "img/icons/exclamation-icon.png";

        let iconImgAttribute = [iconUrl, "availabilityIcon", "15",  "15"];
        let iconImg = createImageWithAttributes (iconImgAttribute);
        goodIcon.append(iconImg);
        goodInnerElements[2].append(goodIcon);

    let stateAttribute = ["div", "productStateText", goodInformation["state"]];
    let goodState = createElementWithAttributes(stateAttribute);
    goodInnerElements[2].append(goodState);


    let addPurchase = "addOnePurchase("+JSON.stringify(goodInformation)+")";
    goodInnerElements[4].setAttribute("onclick", addPurchase);


    good.append(...goodInnerElements);

    return good;
}

function getListContent(dataCategory) {
  let goodsList = document.createElement("div");
  goodsList.setAttribute("class","productCategory");
  for (var key in dataCategory) {
      goodsList.append(createItem(dataCategory[key]));
  }
  return goodsList;

}

function showGoods(dataGoods){
    let categoryNames = ["Приставки", "Игры", "Аксессуары"];

    for (let i = 0; i < 3; ++i){
        let id = 'tab-'+(i+1);

        for (let k = 0; k < 3; ++k){
            let ind = i*3 + k;
            if (isEmptyObject(dataGoods[ind]) == false ){
                let goodsCategoryName = document.createElement("div");
                goodsCategoryName.setAttribute("class","categoryName");
                goodsCategoryName.innerHTML = categoryNames[k];

                document.getElementById(id).append(goodsCategoryName);
                document.getElementById(id).append(getListContent(dataGoods[ind]));
            }
        }
    }
}

let total = 0;

const renderCart = () => {
    let out = '<table> <tr> <th>Наименование</th> <th>Цена, руб</th>';
    out+='<th>Кол-во, шт</th> <th>Стоимость, руб</th> <th> </th> </tr>';
    for (let item of cart) {
        out+='<tr>'
        out+='<td>'+item[1]['object']['name_of_product'] + '</td>';
        out+='<td>'+item[1]['object']['price']+'</td>';
        out+='<td width="150">'+'<button class="button minus" data-id="'+item[0]+'"> </button>';
        out+=item[1]['count'];
        out+='<button class="button plus" data-id="'+item[0]+'"> </button>'+'</td>';
        out+='<td>'+item[1]['object']['price'] * item[1]['count']+'</td>';
        out+='<td> <button class="button delete" data-id="'+item[0]+'"> </button> </td>';
        out+='</tr>';
    };
    out+='</table> <div class="total">ИТОГО: <span class="total_num">' + total + ' руб.</span> </div>';
    document.getElementById('list_of_items').innerHTML = out;
    document.getElementById('empty_cart').style.display = 'none';
    document.getElementById('clean_cart').style.visibility = 'visible';
}

const emptyCart = () => {
    document.getElementById('empty_cart').style.display = 'block';
    document.getElementById('clean_cart').style.visibility = 'hidden';
    document.getElementById('list_of_items').innerHTML = '';
}

emptyCart();

document.onclick = event => {
    if (event.target.classList.contains('plus')) {
        plusFunction(event.target.dataset.id);
    }
    if (event.target.classList.contains('minus')) {
        minusFunction(event.target.dataset.id);
    }
    if (event.target.classList.contains('delete')) {
        deleteFunction(event.target.dataset.id);
    }
    if (event.target.classList.contains('clean_cart')) {
        let confirmation = confirm("Очистить корзину?");
        if (confirmation) {
            cleanCart();
        }
    }
}

const plusFunction = id => {
    id = Number(id);
    if (cart.get(id)['object']['count_of_product'] == cart.get(id)['count']) {
        alert('Извините! Количество данного товара ограничено. Невозможно добавить товар.');
    } else {
        cart.get(id)['count']++;
        total += cart.get(id)['object']['price'];
        alert('Товар добавлен в корзину.');
    }
    renderCart();
}

const minusFunction = id => {
    id = Number(id);
    if (cart.get(id)['count']-1 == 0) {
        deleteFunction(id);
    }
    cart.get(id)['count']--;
    total -= cart.get(id)['object']['price'];
    renderCart();
}

const deleteFunction = id => {
    id = Number(id);
    if (cart.size == 1) {
        cleanCart();
        return;
    }
    total -= cart.get(id)['count'] * cart.get(id)['object']['price'];
    cart.delete(id);
    renderCart();
}

const cleanCart = () => {
    cart.clear();
    total = 0;
    emptyCart();
}

let status = function (response) {
    if (response.status !== 200) {
        return Promise.reject(new Error(response.statusText))
    }
    return Promise.resolve(response)
}
let json = function (response) {
    return response.json()
}

document.addEventListener('DOMContentLoaded', function(){
    fetch("./../res/db.json")
        .then(status)
        .then(json)
        .then(function (dataGoods) {
            console.log('data', dataGoods);
            showGoods(dataGoods);
        })
        .catch(function (error) {
            console.log('error', error)
        })
})
