const iconView = document.querySelector('#icon');
const password = document.querySelector('.password');

iconView.addEventListener('click', () => {
    if (password.type === 'password') {
        password.type = 'text';
        iconView.src = '/eyesOpen.png';
    } else {
        password.type = 'password';
        iconView.src = '/eyesClosed.png';
    }
})