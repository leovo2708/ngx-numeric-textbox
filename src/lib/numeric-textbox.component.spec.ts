import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NumericTextboxModule } from './index';
import { Helper, expect } from '../testing';

@Component({
    selector: 'ngx-test',
    template: ''
})
class TestComponent {
    value = 1;
    onEnter() {
    }
}

function createTestComponent(template: string): ComponentFixture<TestComponent> {
    TestBed.overrideComponent(TestComponent, {
        set: {
            template: template
        }
    }).compileComponents();
    return TestBed.createComponent(TestComponent);
}

describe('NumericTextboxComponent', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let input: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NumericTextboxModule
            ],
            declarations: [
                TestComponent
            ]
        });
    });

    beforeEach(fakeAsync(() => {
        const template = '<ngx-numeric-textbox [(value)]="value" (enter)="onEnter()"></ngx-numeric-textbox>';
        fixture = createTestComponent(template);
        component = fixture.componentInstance;
        fixture.detectChanges();
        tick();
        input = fixture.debugElement.query(By.css('input'));
    }));

    it('should display text "1.00"', () => {
        expect(input.nativeElement.value).toBe('1.00');
    });

    describe('focus', () => {
        beforeEach(fakeAsync(() => {
            input.triggerEventHandler('focus', {});
            fixture.detectChanges();
            tick();
        }));

        it('should display text "1"', () => {
            expect(input.nativeElement.value).toBe('1');
        });
    });

    describe('Press "Enter"', () => {
        let enterSpy: jasmine.Spy;

        beforeEach(fakeAsync(() => {
            enterSpy = spyOn(component, 'onEnter').and.callThrough();
            input.triggerEventHandler('keydown', {
                which: 13
            });
            fixture.detectChanges();
            tick();
        }));

        it('should emit event enter', () => {
            expect(enterSpy.calls.any()).toBeTruthy();
        });
    });

    describe('Input new value "2"', () => {
        beforeEach(fakeAsync(() => {
            Helper.raiseInputEvent(input.nativeElement, '2');
            fixture.detectChanges();
            tick();
        }));

        it('should display text "2"', () => {
            expect(input.nativeElement.value).toBe('2');
        });

        describe('blur', () => {
            beforeEach(fakeAsync(() => {
                input.triggerEventHandler('blur', {});
                fixture.detectChanges();
                tick();
            }));

            it('should display text "2"', () => {
                expect(input.nativeElement.value).toBe('2');
            });
        });
    });
});
