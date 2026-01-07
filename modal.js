'use strict';

// モーダル（ポップアップ）
const modalBtn = document.querySelectorAll('.js_modalBtnCont');
const modalWindow = document.querySelectorAll('.js_modalWrap');
const modalClose = document.querySelectorAll('.js_modalClose');
const modalBG = document.querySelectorAll('.js_modalBG');

window.addEventListener('DOMContentLoaded', function () {
    for (let i = 0; i < modalBtn.length; i++) {
        modalBtn[i].addEventListener('click', function (e) {
            e.preventDefault();
            let dataModalBtn = modalBtn[i].getAttribute('data-modal-btn');
            for (let j = 0; j < modalWindow.length; j++) {
                if (modalWindow[j].getAttribute('data-modal-cont') === dataModalBtn) {
                    modalWindow[j].classList.add('active');
                }
            }
        })
        modalBG[i].addEventListener('click', function () {
            modalWindow[i].classList.add('active2');
            setTimeout(function () {
                modalWindow[i].classList.remove('active');
                modalWindow[i].classList.remove('active2');
            }, 300);
        })
        modalClose[i].addEventListener('click', function () {
            modalWindow[i].classList.add('active2');
            setTimeout(function () {
                modalWindow[i].classList.remove('active');
                modalWindow[i].classList.remove('active2');
            }, 300);
        })
    }
});