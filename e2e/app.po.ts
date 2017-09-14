import { browser, by, element } from 'protractor';

export class NgxNumericTextboxPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('ngx-root h1')).getText();
  }
}
