import {
	Component,
	Input,
	Output,
	EventEmitter,
	OnInit,
	AfterViewInit,
	Injector,
	ElementRef,
	TemplateRef
} from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/throttleTime";
import "rxjs/add/observable/fromEvent";

import { positionElements } from "../common/position.service";

@Component({
	selector: "cdl-popover",
	template: `
		<div class="popover {{placement}}">
			<div *ngIf="showTitle" class="popover-title">
				{{title}}
				<button class="close-icon"  (click)="onClose()">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
					<path d="M14.5 2.6l-1.1-1.1L8 6.9 2.6 1.5 1.5 2.6 6.9 8l-5.4 5.4 1.1 1.1L8 9.1l5.4 5.4 1.1-1.1L9.1 8z"/>
					</svg>
				</button>
			</div>
			<div class="popover-content">
				<template
					*ngIf="isTpl"
					[ngTemplateOutlet]="content">
				</template>
				<div *ngIf="!isTpl">{{content}}</div>
			</div>
		</div>
		`,
	styleUrls: ["./popover.component.scss"],
})
export class Popover implements OnInit, AfterViewInit {
	private offsetTop: number = 48; // 40px heading + 8px triangle

	@Input() title: string;
	@Input() showTitle: boolean = true;
	@Input() placement: "top" | "bottom" | "left" | "right" = "top";
	@Input() content: string | TemplateRef<any>;
	@Input() gap: number = 0;
	@Input() parentRef: ElementRef;
	@Input() appendToBody: boolean = true;

	private zoneSubscription;

	@Output() close: EventEmitter<any> = new EventEmitter();

	private isTpl: boolean;

	constructor(private elementRef: ElementRef) {}

	ngOnInit() {
		this.isTpl = this.content instanceof TemplateRef;

		if (!this.showTitle) {
			this.offsetTop = 8;
		}

		Observable.fromEvent(window, "resize")
		.throttleTime(10)
		.subscribe(() => {
			positionElements(
				this.parentRef.nativeElement,
				this.elementRef.nativeElement,
				this.placement,
				this.appendToBody,
				this.gap,
				this.offsetTop
			);
		});
	}

	ngAfterViewInit() {
		positionElements(
			this.parentRef.nativeElement,
			this.elementRef.nativeElement,
			this.placement,
			this.appendToBody,
			this.gap,
			this.offsetTop
		);
	}

	private onClose() {
		this.close.emit();
	}
}