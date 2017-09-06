import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NumericTextboxModule } from './index';

@Component({
    selector: 'ngx-test',
    template: ''
})
class TestComponent {
    value = 1;
    onEnter() {
        console.log('onEnter');
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
    }));

    describe('Press "Enter"', () => {
        let enterSpy: jasmine.Spy;

        beforeEach(fakeAsync(() => {
            enterSpy = spyOn(component, 'onEnter').and.callThrough();
            const input = fixture.debugElement.query(By.css('input'));
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
});
