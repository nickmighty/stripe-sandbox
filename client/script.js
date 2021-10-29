const buyItem = document.getElementById("buy-item");
buyItem.setAttribute('data-item', 'productOne');

const buyItem2 = document.getElementById("buy-item2");
buyItem2.setAttribute('data-item', 'productTwo');

const subscribeItem = document.getElementById("subscribe-item");
subscribeItem.setAttribute('data-item', 'subscriptionOne');

const testRoute = document.getElementById("test-route");
testRoute.setAttribute('data-item', 'test');
testRoute.setAttribute('test-type', 'cansub');

const testRoute2 = document.getElementById("test-route2");
testRoute2.setAttribute('data-item', 'test');
testRoute2.setAttribute('test-type', 'list')

const testRoute3 = document.getElementById("test-route3");
testRoute3.setAttribute('data-item', 'test');
testRoute3.setAttribute('test-type', 'autosub')

const testRoute4 = document.getElementById("test-route4");
testRoute4.setAttribute('data-item', 'test');
testRoute4.setAttribute('test-type', 'portal')

Array.from(document.getElementsByTagName("button"))
    .map(e => e.getAttribute('data-item') === 'test' ? testEvent(e) : addEvent(e))

function addEvent(ele) {
    ele.addEventListener("click", async (event) => {
        const item = event.target.getAttribute('data-item');
        let tempItem = item.includes('subscription') ? 'subscriptionId' : 'itemId';
        const data = {
            [tempItem]: item,
            callbackUrl: buildCallbackUrl(),
        }
        try {
            const response = await fetch("http://localhost:4242/api/checkout", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            window.location.href = result.redirectUrl;
        } catch (error) {
            console.log(`error: ${JSON.stringify(error)}`)
        }
    })
}

function testEvent(ele) {
    ele.addEventListener("click", async (event) => {
        const testType = event.target.getAttribute('test-type')
        let test;
        switch (testType) {
            case "list":
                test = 'listSub'
                break;
            case "cansub":
                test = 'cancelAllSub'
                break;
            case "autosub":
                test = 'autoSub'
                break;
            case "portal":
                test = "portal"
                break;
            default:
                console.log('caught');
        }

        try {
            const response = await fetch(`http://localhost:4242/api/test/${test}`, {
                method: "GET",
            });
            // const result = await response.json();
        } catch (error) {
            console.log(`error: ${JSON.stringify(error)}`)
        }
    })
}

function buildCallbackUrl() {
    const protocol = window.location.protocol,
        hostName = window.location.hostname,
        port = window.location.port
    let callbackUrl = `${protocol}//${hostName}`;
    if (port) {
        callbackUrl += ':' + port;
    }
    return callbackUrl
}
