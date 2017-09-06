import { DebugElement } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

export const ButtonClickEvents = {
    left: { button: 0 },
    right: { button: 2 }
};

export const Helper = {
    createGenericTestComponent: createGenericTestComponent,
    raiseClickEvent: raiseClickEvent,
    raiseInputEvent: raiseInputEvent,
    raiseKeydownEvent: raiseKeydownEvent,
    raiseEvent: raiseEvent
};

function createGenericTestComponent<T>(html: string, type: { new(...args: any[]): T }): ComponentFixture<T> {
    TestBed.overrideComponent(type, { set: { template: html } });
    const fixture = TestBed.createComponent(type);
    fixture.detectChanges();
    return fixture as ComponentFixture<T>;
}

function raiseClickEvent(element: DebugElement | HTMLElement, eventObj: any = ButtonClickEvents.left) {
    if (element instanceof HTMLElement) {
        element.click();
    } else {
        element.triggerEventHandler('click', eventObj);
    }
}

function raiseInputEvent(input: HTMLInputElement, value: string) {
    input.value = value;
    input.dispatchEvent(new Event('input'));
}

function raiseKeydownEvent(input: HTMLInputElement, code: string) {
    input.dispatchEvent(new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        code: code
    }));
}

function raiseEvent(element: HTMLElement, event: Event) {
    element.dispatchEvent(event);
}
