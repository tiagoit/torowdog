import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
export interface DialogData {
title: String;
}

@Component({
    selector: 'dialog-confirm',
    templateUrl: 'dialog-confirm.html',
})
export class DialogConfirm {
    constructor(public dialogRef: MatDialogRef<DialogConfirm>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}