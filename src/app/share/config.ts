export class Config {

    static get apiUrl(): string {
        return "http:" + '//' ;
    }
    static get baseUrl(): string {
        return window.location.protocol + '//' + 'localhost:4545';

    }
    static get itemPerPage(): number {
        return 10;
    }


    static skipCanDeactivateGuard: boolean = false;

    static stripeKey="pk_test_51I9ehvHyg5mkVfE7IxuFmH9v5aSlOU8K9vsOYhiS8TOqY2LpUM0cFImNXIGdkHinv7pN6cVItvDMDNnZ2KPFG0uF00dPc1n5uj";


    static get isSocialLogin(): boolean{
        if(localStorage.getItem('isSocialLogin')=='true'){
            return true;
        }else{
            return false;
        }
    }

    static get getLoginUser() {
        let userDetails = null;
        if (localStorage.getItem('userDetails') !== null) {
            userDetails = JSON.parse(localStorage.getItem('userDetails'));
        }
        return userDetails;
    }

    static get homePageUrl(): string {
        let path = this.baseRoute +'/dashboard/home';

        return path;
    }


    static get getToken(): string {
       return localStorage.getItem('token') ;
    }


    static get loginFirstName(): string {

        return localStorage.getItem('firstname');
    }

    static get loginLastName(): string {

        return localStorage.getItem('lastname');
    }

    static get loginFullName(): string {
        if(localStorage.getItem('firstname') != null || localStorage.getItem('lastname')!=null){
            return localStorage.getItem('firstname') + ' ' + localStorage.getItem('lastname');
        }else{
            return "";
        }
       
    }

    static get loginEmail(): string {

        return localStorage.getItem('email');
    }

    static get websiteId(): string {
        return localStorage.getItem('website_id');
    }



    static get baseRoute(): string {
        if (this.loginFirstName === null || this.loginFirstName === undefined)
            return "trade";
        else
            return "trade";//+this.loginFirstName;
    }
    static get baseRouteName(): string {
        if (this.loginFirstName === null || this.loginFirstName === undefined)
            return "";
        else
            return this.loginFirstName;
    }

    static get activityLog(): string {
        return "activity-log";
    }
   
}
