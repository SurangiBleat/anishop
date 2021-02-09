console.log('NAV');

document.querySelector('.close-nav').onclick = closeNav;
document.querySelector('.show-nav').onclick = showNav;
document.querySelector('.engine').onclick = searchTime;

function closeNav() {
    document.querySelector('.site-nav').style.left = '-300px';
}
function showNav() {
    document.querySelector('.site-nav').style.left = '0';
}

function searchTime() {
    fetch('/search',{
        method: 'GET'
    })
}
/* for category ONLY */
function getCategoryList() {
    fetch('/get-category-list',
        {
            method: 'POST'
        }
    ).then(function (response) {
        console.log(response);
        return response.text();
    }
    ).then(function (body) {
        // console.log(body);
        showCategoryList(JSON.parse(body));
    })
}

function showCategoryList(data) {
    // console.log(data);
    let out = '<ul class="category-list">';
    for (let i = 0; i < data.length; i++) {
        out += `<li><a href="/cat?id=${data[i]['id']}">${data[i]['category']}</a></li>`;
    }
    out += '</ul>';
    document.querySelector('#category-list').innerHTML = out;
}

/* for shops ONLY */
function getShopList() {
    fetch('/get-shop-list',
        {
            method: 'POST'
        }
    ).then(function (response) {
        // console.log(response);
        return response.text();
    }
    ).then(function (body) {
        // console.log(body);
        showShopList(JSON.parse(body));
    })
}

function showShopList(data) {
    // console.log(data);
    let out = '<ul class="shop-list">';
    for (let i = 0; i < data.length; i++) {
        out += `<li><a href="/shop?id=${data[i]['id']}">${data[i]['name']}</a></li>`;
    }
    out += '</ul>';
    document.querySelector('#shop-list').innerHTML = out;
}

/* main code */
getCategoryList();
getShopList();
searchTime();