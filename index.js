const formEl = document.querySelector('#myForm');
const submitButton = document.querySelector('#submitButton');
const resultContainer = document.querySelector('#resultContainer');
const fioRegExp = /^([а-яё]+ ){2}[а-яё]+$/i;
const emailRegExp = /^[a-z][a-z\d\-\.]{0,28}[a-z\d]@(ya\.ru|yandex\.ru|yandex\.ua|yandex\.by|yandex\.kz|yandex\.com)$/;
const phoneRegExp = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
const formAction = formEl.getAttribute('action');


const myForm = {
    getData(){
        return {
            fio: formEl.fio.value,
            email: formEl.email.value,
            phone: formEl.phone.value
        };
    },
    setData(data){
        formEl.fio.value = data.fio,
        formEl.email.value = data.email,
        formEl.phone.value = data.phone
    },
    validate(data){
        let isValid = true;
        let errorFields = [];

        if(!fioRegExp.test(data.fio)){
            isValid = false;
            formEl.fio.classList.add('error');
            errorFields.push('fio');
        }else{
            formEl.fio.classList.remove('error');
        }

        if(!emailRegExp.test(data.email)){
            isValid = false;
            formEl.email.classList.add('error');
            errorFields.push('email');
        }else{
            formEl.email.classList.remove('error');
        }

        if( !phoneRegExp.test(data.phone) || overThirty(data.phone) ){
            isValid = false;
            formEl.phone.classList.add('error');
            errorFields.push('phone');
        }else{
            formEl.phone.classList.remove('error');
        }

        return { isValid, errorFields }



    },
    submit(event){
        event.preventDefault();
        let data = this.getData();
        let isValid = this.validate(data).isValid;
        if(isValid){
            submitButton.disabled = true;
            request(data, formAction)
                .then(message => {
                    resultContainer.classList.remove('progress');
                    submitButton.disabled = false;
                    if(message.status=='error'){
                        resultContainer.classList.add('error');
                        resultContainer.classList.remove('success');
                        resultContainer.innerText = message.reason;
                    }else{
                        resultContainer.classList.add('success');
                        resultContainer.classList.remove('error');
                        resultContainer.innerHTML = '&nbsp;';
                    }
                })
                .catch(err => {
                    console.log('request err:');
                    console.log(err);
                })
        }else{
            resultContainer.classList.remove('error');
            resultContainer.classList.remove('success');
            resultContainer.innerHTML = '&nbsp;';
        }
    }
};

function overThirty(phone){
    let result = phone.replace(/\D/g,'')
        .split('')
        .reduce((sum, current) => { return sum + parseInt(current) }, 0);
    return result > 30;
}

function request(data, url){

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            body: data
        })
            .then(res => {
                return res.json();
            })
            .then(message => {
                if(message.status == 'progress'){
                    resultContainer.classList.add('progress');
                    resultContainer.innerHTML = '&nbsp;';
                    setTimeout(()=>{
                        resolve(request(data, url));
                    }, message.timeout);
                }else{
                    resolve(message);
                }
            })
            .catch(err => {
                console.log('fetch err:');
                reject(err);
            })
    });
}
