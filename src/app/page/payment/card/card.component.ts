import { AfterViewInit, Component, OnInit, NgModule, Input} from '@angular/core';
import { CardService } from 'src/app/service/payment/card.service';
import { environment } from 'src/environments/environment';
import { Square } from '@square/web-sdk'


declare function initPayments(applicationId:any,locationId:any):any;
declare function handlePaymentMethodSubmission(apiPayment:any,card:any, payments:any, locationId:any, amount:any):void;
declare function getPayments():any;
declare function getCard():any;

@Component({
  selector: 'app-payment-card',
  templateUrl: './card.component.html'
})
export class CardComponent  implements OnInit {
  payWidthCard:boolean =true;
  paymentResult:any;

  @Input()
  valuePayWidthCard : number = 0;

  constructor(
    private cardService: CardService,
  ){
  }
  ngOnInit(): void {
  this.cardService.loadScript('square');
}
get getPayWidthCard(){
  return this.payWidthCard;
}
deactivatePayWidthCard():void {
  this.payWidthCard = false;
}
getInitPayments(){
  let applicationId = environment._applicationId;
  let locationId = environment._locationId;
  initPayments(applicationId,locationId);
  this.deactivatePayWidthCard();
}
getValue(){
  return this.valuePayWidthCard;
}
async getHandlePaymentMethodSubmission(){
  let result;
  try{
    result = await handlePaymentMethodSubmission(environment._apiPayment,getCard(),getPayments(), "",this.getValue());
  } catch (error) {
  console.error(error);
  }
  console.log(result)
  this.paymentResult = JSON.stringify(result);
  console.log(this.paymentResult);

}

}
