styleCurrentLink()
function styleCurrentLink(){
    const path = window.location.pathname;
    const page = path.split("/").pop();
    document.querySelectorAll('a[href="'+page+'"]').forEach(
        function(elem){
            elem.className += ' current-link'
            elem.href = "#"
        }
    ); 
}
