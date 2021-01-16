const HOST = 'https://serverless-o6ytz66d0.vercel.app';
const ID_MEALS_LIST = 'meals-list';
const ID_ORDERS_LIST = 'orders-list';
const ID_MEALS = 'id-meals';

const stringToHTML = (s) => {
    const parse = new DOMParser();
    const doc = parse.parseFromString(s, 'text/html');

    return doc.body.firstChild;
};

const reduceItemsMeals = (accumalator, currentValue) => {
    const element = stringToHTML(`<li id=${currentValue._id} >${currentValue.name}</li>`);

    element.addEventListener('click', () => {
        const mealsId = document.getElementById(ID_MEALS);
        cleanItemSelected();
        element.classList.add('selected');
        mealsId.value = currentValue._id;
    });

    return accumalator.concat(element);
};

const reduceItemsOrders = (accumalator, currentValue) => {
    const elementOrder = createElementOrder(currentValue);
    return accumalator.concat(elementOrder);
};

const createElementOrder = (order) => {
    const meals = document.getElementById(ID_MEALS_LIST).children;
    if (!meals) return;
    const mealElement = Array.from(meals).find(meal => meal.id === order.meal_id);
    return stringToHTML(`<li>${mealElement.textContent} - ${order.user_id}</li>`);
};

const cleanItemSelected = () => {
    const mealsList = document.getElementById(ID_MEALS_LIST);
    Array.from(mealsList.children).forEach(x => x.classList.remove('selected'));
};

const renderListElements = (nameId, data, reduce) => {
    const elements = document.getElementById(nameId);
    const listItems = data.reduce(reduce, []);
    elements.removeChild(elements.firstElementChild);
    listItems.forEach(item => elements.appendChild(item));
};

const inicialForms = () => {
    const form = document.getElementById('forms-orders');
    form.onsubmit = (e) => {
        e.preventDefault();
        const mealsId = document.getElementById(ID_MEALS);
        const button = document.getElementById('btn-orders');
        button.setAttribute('disabled', true);
        if (!mealsId.value) {
            alert('Selected a meals');
            return;
        }

        const order = {
            meal_id: mealsId.value,
            user_id: 'ncarabal'
        }

        const options = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        }

        fetch(`${HOST}/api/orders/`, options)
            .then(response => response.json())
            .then(data => {
                const orders = document.getElementById(ID_ORDERS_LIST);
                const element = createElementOrder(data);
                orders.appendChild(element);
                mealsId.value = undefined;
                cleanItemSelected();
                button.removeAttribute('disabled');
            })
            .catch(err => console.err(`Error with server ${err}`));

    }
}

const inicialData = () => {
    fetch(`${HOST}/api/meals/`)
        .then(response => response.json())
        .then(data => {
            renderListElements(ID_MEALS_LIST, data, reduceItemsMeals);
            const button = document.getElementById('btn-orders');
            button.removeAttribute('disabled');
            fetch(`${HOST}/api/orders`)
                .then(response => response.json())
                .then(data => {
                    renderListElements(ID_ORDERS_LIST, data, reduceItemsOrders);
                })
                .catch(err => console.error(`Error with server orders ${err}`));
        })
        .catch(err => console.error(`Error with server meals ${err}`));
}

window.onload = () => {
    inicialForms();
    inicialData();
}