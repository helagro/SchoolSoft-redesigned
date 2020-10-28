const navCheckbox = document.getElementById('hidden_menu_checkbox')
const dimmer = document.getElementById('dimmer')

const smallScreenNavThreashold = 920


var lastWindowWidth = -1
var lastDropdown


main()
function main(){
    window.addEventListener('resize', onWindowResized);
    hideMenu() //prevents cashe bugs
}


//ANCHOR Inputs
function onNavCheckboxClicked(){
    if(!isSmallscreenMenu(window.innerWidth)) //prevents unintended dimming in largescreen devices
        return 
    dimScreen(navCheckbox.checked)
}
function onWindowResized(){
    if(!navCheckbox.checked)
        return

    const wasSmallMenu = isSmallscreenMenu(lastWindowWidth)
    const isSmallMenu = isSmallscreenMenu(window.innerWidth)

    if(wasSmallMenu != isSmallMenu)
        hideMenu()
}
function onDimmerClicked(){
    hideMenu()
    removeOldDropdown(lastDropdown)
}
function onNavTouch(event){
    const target = event.target || event.srcElement;
    const id = target.id
    const dropdown = getRelevantDropdown(id)

    const replaced = replaceDropdown(dropdown, target)
    if(replaced)
        dimScreen(true)
    return false
}


function isSmallscreenMenu(width){
    return width < smallScreenNavThreashold
}
function hideMenu(){
    navCheckbox.checked=false;
    dimScreen(false)
}
function dimScreen(on){
    dimmer.style.display = on ? 'block' : 'none'
}
function isDimmed(){
    return dimmer.style.display == "block"
}


//ANCHOR handle touchscreen
function getRelevantDropdown(linkId){
    const dropDownId = linkId + "_more"
    return document.getElementById(dropDownId)
}

function replaceDropdown(newDropdown, clickedLink){
    removeOldDropdown(lastDropdown)

    if(userClickedSameLinkAgain(newDropdown, lastDropdown) && isDimmed() && !isSmallscreenMenu(window.innerWidth)){
        dimScreen(false)
        return false
    }

    showNewDropdown(newDropdown, clickedLink)
    lastDropdown = newDropdown
    return true
}
function userClickedSameLinkAgain(newDropdown, lastDropdown){
    return newDropdown == lastDropdown
}


//Remove dropdown
function removeOldDropdown(dropdown){
    if(dropdown == undefined || dropdown.style.display == "none")
        return 

    dropdown.style.display = "none"
    removeDropdownHeaderLink(dropdown)
}
function removeDropdownHeaderLink(dropdown){
    dropdown.removeChild(dropdown.childNodes[0])
}



//show dropdown
function showNewDropdown(dropdown, clickedLink){
    dropdown.style.display = "grid"
    createDropdownHeaderLink(dropdown, clickedLink)
}
function createDropdownHeaderLink(dropdown, link){
    const newLink = document.createElement("a")
    newLink.href = link.href
    newLink.innerHTML = link.innerHTML
    newLink.className = "dropdown_main_link"
    dropdown.insertBefore(newLink, dropdown.firstChild)
}