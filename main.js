function Validator(formSelector,) {
    
    var _this = this;

    var formRules = {};


    function getParent(element,selector) {
        while(element.parentElement){
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    /**
     * Quy ước tạo rule
     * -   Nếu có lỗi thì return 'error'
     * -   Nếu không có lỗi return underfined
     */
    var validatorRules = {
        required: function (value) {
            return value ? undefined : 'Vui lòng nhập trường này';
        },
        email: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập email';
        },
        min : function (min) {
            return  function (value) {
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} kí tự`;
            } 
        },
        max : function (max) {
            return function (value) {
                return value.length <= max ? undefined : `Vui lòng nhập lớn hơn ${max} kí tự`;
            } 
        }
    };

    // lấy ra form element trong DOM theo formSelector
    var formElement = document.querySelector(formSelector);
    if (formElement) {
        // lấy ra tất cả các input
        var inputs = formElement.querySelectorAll('[name][rules]');
        for (var input of inputs) {
            // lấy ra rule của input đó
            var rules = input.getAttribute('rules').split('|');
            for (var rule of rules) {
                var ruleInfo;
                var isRuleHasValue = rule.includes(':');

                if (isRuleHasValue) {
                    // lấy ra info của rule
                    ruleInfo = rule.split(':');

                    rule = ruleInfo[0];

                    // console.log(validatorRules[rule](ruleInfo[1]));

                    // console.log(ruleInfo)
                }

                var ruleFunc = validatorRules[rule];

                if (isRuleHasValue) {
                    ruleFunc = ruleFunc(ruleInfo[1]);
                }
                

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc);
                }
                else
                {
                    formRules[input.name] = [ruleFunc];
                }

                // console.log(rule);
            }


            // lắng nghe sự kiến để validator (blur, change,...)

            input.onblur = handleValidate;
            input.oninput = handleClearError;
        }

        // hàm thực hiện validator
        function handleValidate(event){
            // console.log(event.target.value);

            var rules = formRules[event.target.name];
            var errorMessage;

            for (var rule of rules) {
                errorMessage = rule(event.target.value);
                if (errorMessage) {
                    break;
                }
            }
            

            // nếu có lỗi thì hiển thị UI
            if (errorMessage) {
                // console.log(event.target);
                var formGroup = getParent(event.target,'.form-group');
                // console.log(formGroup);
                if (formGroup) {
                    formGroup.classList.add('invalid');
                    var formMessage = formGroup.querySelector('.form-message');
                    if (formMessage) {
                        formMessage.innerText = errorMessage;
                    }
                }
            }

            // console.log(errorMessage);
            return !errorMessage;
        }

        // hàm clear message error
        function handleClearError(event) {
            var formGroup = getParent(event.target,'.form-group');
            if (formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid');

                var formMessage = formGroup.querySelector('.form-message');
                if (formMessage) {
                    formMessage.innerText = '';
                }
            }
        }

        console.log(formRules);
    }

    formElement.onsubmit = function (event) {
        event.preventDefault();

        var inputs = formElement.querySelectorAll('[name][rules]');
        var isValid = true;
        for (var input of inputs) {
            // console.log(input.value.name);

             if (!handleValidate({target : input})) {
                isValid = false;
             } 

        }       

        // khi không có lỗi thì submit form
        if (isValid) {
            
            if (typeof _this.onSubmit === "function") {
                var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');

                    var formValues = Array.from(enableInputs)
                    .reduce(function (values,input) {
                        

                        switch (input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="'+ input.name +'"]:checked').value;
                                break;
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    values[input.name] = '';
                                    return values;
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                        
                            default:
                                values[input.name] = input.value;
                                break;
                        }

                        return values;
                    },{});
                console.log(formValues);
                _this.onSubmit(formValues);
            }
            else
            {
                formElement.submit();   
            }
            
            
        }

    }
}