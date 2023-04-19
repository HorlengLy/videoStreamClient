
export const generatorRoom = ()=>{
    const date = Date.now();
    return date.toString(36);
}

export const reerConstrain = {
    video:{
        facingMode:'environment',
        width:{min:200,max:500},
        height:{min:100,max:300}
    },
    audio:true,
}
export const frontConstrain = {
    video:{
        facingMode:'user',
        width:{min:200,max:500},
        height:{min:100,max:300}
    },
    audio:true,
}

export const copyText = ()=>{
    const text = document.querySelector("#room");
    text.select();
    text.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(text.value);
    document.querySelector("#btnCopy").classList.add("dark:bg-green-600")
    document.querySelector("#btnCopy").textContent = "copied";
}

export function innerTextAnimate(text){
    if (!text) return;
    setTimeout(()=>{
        text.textContent = "Enjoy Video Call With Your GirlFriend"
    },0)
    setTimeout(()=>{
        text.textContent = "Enjoy Video Call With Your Family"
    },4000)
    setTimeout(()=>{
        text.textContent = "Enjoy Video Call With Your Friends"
    },8000)
    setTimeout(()=>{
        text.textContent = "Enjoy Video Call With Your Partner"
    },12000)
}