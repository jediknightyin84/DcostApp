import { Directive, ElementRef, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Gesture } from "ionic-angular/gestures/gesture";

/**
 * Generated class for the LongPressDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[long-press]' // Attribute selector
})
export class LongPressDirective implements OnInit, OnDestroy {

  el: HTMLElement;
	pressGesture: Gesture;
  @Output('long-press') onPressRelease: EventEmitter<any> = new EventEmitter();
  
  constructor(el: ElementRef) {
    console.log('Hello LongPressDirective Directive');
    this.el = el.nativeElement;
  }

  ngOnInit() {
		this.pressGesture = new Gesture(this.el);
		this.pressGesture.listen();

		this.pressGesture.on('press', (event) => {
			this.onPressRelease.emit('released');
		});
	}

	ngOnDestroy() {
		this.pressGesture.destroy();
	}

}
