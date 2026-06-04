const likeButtons = document.querySelectorAll('.like-btn');

likeButtons.forEach(btn => {
    btn.addEventListener('click', () =>{
        const countSpan = btn.nextElementSibling;
        let count = parseInt(countSpan.textContent);

        if(btn.classList.contains('liked')){
            btn.classList.remove('liked');
            count--;
        }
        else{
            btn.classList.add('liked');
            count++;
        }  

        countSpan.textContent = count;
    });
});