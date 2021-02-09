const publishMsgBtn = document.querySelector('.publish');
const publishMsgTxt = document.querySelector('.publishText');
const receiveMsgBtn = document.querySelector('.receive');
const receiveMsgTxt = document.querySelector('.receiveText');

publishMsgBtn.addEventListener('click', ()=> {
    console.log(publishMsgTxt.value);
    return fetch(`/publishMessage?data=${publishMsgTxt.value}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'same-origin',
	}).then(
        (data) => data.json().then((json) => {
            if (!data.ok) {
                throw new Error(JSON.stringify(json));
            } else {
                publishMsgTxt.value = '';
            }
        }),
    ).catch((error) => {
        console.error(error);
    });
});

receiveMsgBtn.addEventListener('click', async () => {
    const response = await fetch('/getMessages', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
    })
    .then(response => response.json())
    .then(json => receiveMsgTxt.value = json);
});
