function Validator(formSelector) {
    var formRules = {

    };
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
        }
        console.log(formRules);
    }
}