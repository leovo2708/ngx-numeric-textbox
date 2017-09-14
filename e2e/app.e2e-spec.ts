import { NgxNumericTextboxPage } from './app.po';

describe('ngx-numeric-textbox App', () => {
  let page: NgxNumericTextboxPage;

  beforeEach(() => {
    page = new NgxNumericTextboxPage();
  });

  it('should display "ngx-numeric-textbox"', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('ngx-numeric-textbox');
  });
});
