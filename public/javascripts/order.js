document.querySelector('#anishopu-order').onsubmit = function(event){
    event.preventDefault();
    let username = document.querySelector('#username').value.trim();
    let surname = document.querySelector('#surname').value.trim();
    let phone = document.querySelector('#phone').value.trim();
    let email = document.querySelector('#email').value.trim();
    let address = document.querySelector('#address').value.trim();

    if (!document.querySelector('#rule').checked) {
        //с правилами не согласен
        Swal.fire({
            buttonsStyling: false,
            title: 'Внимание!',
            text: 'Ты не принял условия соглашения',
            icon: 'info',
            confirmButtonText: 'Ладно, ладно. Мы поняли!'
        });
        return false;
    }


    if (username == '' || phone == '' || email==''){
        // не заполнены поля
        Swal.fire({
            buttonsStyling: false,
            title: 'Внимание!',
            text: 'Проверь, все ли ты поля заполнил',
            imageUrl : 'https://sun9-72.userapi.com/impf/OcEtxE_J7fgPvok30tjvPp-TYLJmLEKN-Bh2qg/lJNoi2qmSQk.jpg?size=662x675&quality=96&sign=69930cb617e1e9ca6b0daf7c67beb6f6&type=album',
            confirmButtonText: 'Ок'
        });
        return false;
    }

    fetch('/finish-order',{
        method: 'POST',
        body: JSON.stringify({
            'username': username,
            'surname': surname,
            'phone' : phone,
            'email' : email,
            'address' : address,
            'key' : JSON.parse(localStorage.getItem('cart'))
        }),
        headers: {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        }
    })
    .then(function(response){
        return response.text();
    })
    .then(function(body){
        if (body == 1){
            Swal.fire({
                buttonsStyling: false,
                title: 'Успешно!',
                text: 'Скоро с тобой свяжется менеджер для уточнения деталей',
                timer: 4000,
                imageUrl : 'https://sun9-65.userapi.com/impf/0HtASn4uF3vQIZsuXuZ0fFU6N_8lss1JdnxBEA/Lavs5CAucso.jpg?size=1200x628&quality=96&sign=5b4346bf6cb86398bfbabc6280cec09b&type=album',
                confirmButtonText: 'Ок'
            }).then(function(){
                window.location.href = '/';
            });
        }
        else{
            Swal.fire({
                buttonsStyling: false,
                title: 'Внимание!',
                text: 'Проверь, все ли ты поля заполнил',
                imageUrl : 'https://4.downloader.disk.yandex.ru/preview/19b6c85b9c288660c41e6385f27124287fa8a3daa22994f60f37fbbc2a48370f/inf/Bs3QV1A4MFSnmhWzyBFm8dzJnmI81IHYTPQ2GPwvzxJ8AQFWix5sx_6j_9TpzkdgGVgZSc06XvEeCfOHN8rnkg%3D%3D?uid=880658809&filename=gthink.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=880658809&tknv=v2&size=1903x969',
                confirmButtonText: 'Ок'
        });
        }
    })
}