import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepoGrid } from './repo-grid';

describe('RepoGrid', () => {
  let component: RepoGrid;
  let fixture: ComponentFixture<RepoGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepoGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepoGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
