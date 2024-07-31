# Echoes | JavaScript
Echoes is a powerful and versatile JavaScript library designed to help you easily manage your website and the interactions within it.

With Echoes, you can get any useful information from any page you are creating.
The library is designed to be intuitive and easy to use, while offering a wide range of functionality to monitor and react to various browser and DOM events.

Echoes has it's own [website](https://echoes.leonardoulino.com), where you can find the [documentation](https://echoes.leonardoulino.com/docs), [examples](https://echoes.leonardoulino.com/examples) and more.

### Repository Info

![GitHub Release](https://img.shields.io/github/v/release/Noel-Em/EchoesJS) ![GitHub License](https://img.shields.io/github/license/Noel-Em/EchoesJS)
![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/Noel-Em/EchoesJS/total)
## Template

    import  *  as ECHOES from  './echoes.min.js';
    
    const  handler  =  new ECHOES.EventHandler();
    
    handler.onStart(() => {
	    // Write everything that happens when you open the website
    });
    
    handler.onUpdate(() => {
	    // Write everything that needs to happen in the loop
    });


## Events

Echoes inserts the **event** structure into JavaScript.
Events can be of any type, from changing the mouse position to scrolling the page. 
Although it is very reductive to speak only of these events.

It is also possible to create **completely customized events** that depend on the user's conditions.

There are multiple types of Events:
 - OnHover
 - OnClick
 - OnBackgroundColor
 - OnBackgroundColorChange
 - OnTextColorChange
 - OnTextColor
 - MousePos
 - ScrollPos
 - TabInfo
 - PageInfo
 - WebInfo
 

Each of these event have multiple functions that can be called.

## Example

    import * as ECHOES from './echoes.min.js';

    const handler = new ECHOES.EventHandler();

    handler.onStart(() => {
	    ECHOES.addEvent('PositionChanged', new ECHOES.MousePos());
    });
    
    handler.onUpdate(() => {
	    if(ECHOES.getEvent('PositionChanged').changed()) {
		    console.log('The mouse position has changed');
	    }
    });
