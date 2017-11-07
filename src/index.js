import pEvent from 'p-event';
import { requestAnimationFrame, cancelAnimationFrame } from 'animation-frame-polyfill';

export default class Toggle {
    constructor(element, {
        display = 'block',
        show = ()=>{},
        hide = ()=>{}
    } = {}){
        this._show = show;
        this._hide = hide;
    }
    add(className){
        return change(this.element, 'add', className);
    }
    toggle(className){
        return change(this.element, 'toggle', className);
    }
    remove(className){
        return change(this.element, 'remove', className);
    }
    show(){
        return Promise.resolve(this._show())
        .then(e=>{
            this.element.style.display = this.display;
            const event = new Event('show');
            this.element.dispatchEvent(event);
        });
    }
    hide(){
        return Promise.resolve(this._hide())
        .then(e=>{
            this.element.style.display = 'none';
            const event = new Event('hide');
            this.element.dispatchEvent(event);
        });
    }
}

function change(el, type, className, newClass){

    return new Promise(resolve=>{
        let transition = false;

        if(type === 'remove'){
            return resolve();
        }

        function onEnd(e){
            el.removeEventListener('transitionend', onEnd, false);
            el.removeEventListener('transitionstart', onStart, false);
            resolve(e);
        }

        function onStart(e){
            transition = true;
        }

        el.addEventListener('transitionend', onEnd, false);
        el.addEventListener('transitionstart', onStart, false);

        requestAnimationFrame(()=>{
            if(type === 'replace'){
                el.classList[type](className);
            }else{
                let result = el.classList[type](className);
                if(type === 'toggle' && !result){
                    return onEnd();
                }
            }

            setTimeout(()=>{
                if(!transition){
                    onEnd();
                }
            });
        });

    });
}
