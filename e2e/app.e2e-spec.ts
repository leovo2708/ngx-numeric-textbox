import { NgxNumericTextboxPage } from './app.po';

describe('ngx-numeric-textbox App', () => {
  let page: NgxNumericTextboxPage;

  beforeEach(() => {
    page = new NgxNumericTextboxPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
