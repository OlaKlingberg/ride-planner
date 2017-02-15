import { RidePlanner2Page } from './app.po';

describe('ride-planner2 App', function() {
  let page: RidePlanner2Page;

  beforeEach(() => {
    page = new RidePlanner2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
