const buyItem = document.getElementById("buy-item");
buyItem.setAttribute('data-item', 'productOne');

const buyItem2 = document.getElementById("buy-item2");
buyItem2.setAttribute('data-item', 'productTwo');

Array.from(document.getElementsByTagName("button"))
  .map(e => addEvent(e))

function addEvent(ele) {
    ele.addEventListener("click", async (event) => {
            const item = event.target.getAttribute('data-item')
            const data = { 
                item,
                callbackUrl: buildCallbackUrl()
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


