
/*************************************************************************
 _        __   ____   ____     ___       ______   __   __   ______   _
| |  __  /  / |  __| |  _  \  |    \    /  ___/  \  \ /  / /  ___/ _| |__
| | /  |/  /  | |__  | |_| /  | |\  \   |  |___   \  \  / |  |___ |_   _/
| |/      /   |  __| |  _  \  | |_\  \   \___  \   \   /   \___  \  | |
|   /|   /    | |__  | |_|  | |  ___  \  ____|  |  /  /    ____|  | | |__
|__/ |__/     |____| |_____/  |_|   \__\ \_____/  /__/     \_____/  |____|

*************************************************************************/

const REGEX_VALIDATE = /^\s*(\d+)\s*,\s*(\d+)\s*$/m;
let fInput = $('#opt');

// Валидация данных
function validate(str) {
    return REGEX_VALIDATE.test(str);
}

// Получение конкретных значений массы и длины
function getInteger(str) {
    let arr = REGEX_VALIDATE.exec(str);
    if (arr !== null && arr.length > 1) {
        return [arr[1], arr[2]];
    }
    else {
        return [];
    }
}

// Формирование сообщения о результате проверки
function alertMessage(obj, type, message) {
    obj.removeClass('alert-danger alert-success')
        .addClass(type ? 'alert-success' : 'alert-danger')
        .text(message);
}

// Обработчик события редактирования поля
fInput.on('input', function () {
    fInput.removeClass('is-invalid');
    $('.alert').parent().addClass('d-none');
});

// Отправка данных формы
$('form').on('submit', function (event) {
    event.preventDefault();
    let objAlert;
    let elpWeigth;
    let elpLength;

    if (validate(fInput.val()) === true) {
        $('form button').prop('disabled', 'disabled');
        $('form button span').removeClass('d-none');
        objAlert = $('#elpCheck .alert');
        [elpWeigth, elpLength] = getInteger(fInput.val());
        $.ajax({
            method: 'POST',
            url: 'route.php',
            data: {
                route: 'check',
                weigth: elpWeigth,
                length: elpLength
            },
            complete: function () {
                $('form button').prop('disabled', '');
                $('form button span').addClass('d-none');
            },
            success: function (data) {
                if (data.hasOwnProperty('skip')) {
                    if (data.skip === true) {
                        alertMessage(objAlert, true, 'Пропустить слона на продажу');
                        objAlert.parent().removeClass('d-none');
                    }
                    else {
                        alertMessage(objAlert, false, 'Отправить слона в брак');
                        objAlert.parent().removeClass('d-none');
                    }
                }
            },
            error: function (err) {
                alertMessage(objAlert, false, 'Ошибка передачи параметров');
                console.warn('ERROR #7489', err);
            }
        });
    }
    else {
        fInput.addClass('is-invalid');
    }
});

// Обработчик кнопки "Проверка параметров"
$('#elpCheck-tab').on('click', function (event) {
    event.preventDefault();
    $('.js-spinner').removeClass('d-none');
    $('.js-tableHistory').addClass('d-none');
});


// Получение отчета
// Обработчик кнопки "История проверок"
$('#elpHistory-tab').on('click', function (event) {
    event.preventDefault();
    $.ajax({
        method: 'POST',
        url: 'route.php',
        dataType: 'json',
        data: {
            route: 'report'
        },
        complete: function () {
            $('.js-spinner').addClass('d-none');
        },
        success: function (data) {
            let result;
            let row = '';
            let id = 1;
            let countSkip = data.hasOwnProperty('countSkip') ? data['countSkip'] : 0;
            let countDefect = data.hasOwnProperty('countDefect') ? data['countDefect'] : 0;

            if (data.hasOwnProperty('result')) {
                result = data['result'];
                for (let index in result) {
                    row += '<tr class="'+ (result[index][2]?'table-success':'table-danger') +'">\
                        <th scope="row">'+ id++ +'</th>\
                        <td>'+ result[index][0] +'</td>\
                        <td>'+ result[index][1] +'</td>\
                        </tr>';
                }
                $('.js-tableHistory table tbody').empty().append(row);
                $('.js-tableHistory').removeClass('d-none');
            }

            $('.js-tableHistory span.badge-success').text('Качественных: '+ countSkip +' шт.');
            $('.js-tableHistory span.badge-danger').text('Бракованных: '+ countDefect +' шт.');
        },
        error: function (err) {
            alertMessage($('#elpHistory .alert'), false, 'Ошибка при получении данных');
        }
    });
});


// press F12 to browser
console.log('   _        __   ____   ____     ___        ______  __   __   ______   _\n  | |  __  /  / |  __| |  _  \\  |    \\     /  ___/ \\  \\ /  / /  ___/ _| |__\n  | | /  |/  /  | |__  | |_| /  | |\\  \\   |  |___   \\  \\  / |  |___ |_   _/\n  | |/      /   |  __| |  _  \\  | |_\\  \\   \\___  \\   \\   /   \\___  \\  | |\n  |   /|   /    | |__  | |_|  | |  ___  \\  ____|  |  /  /    ____|  | | |__\n  |__/ |__/     |____| |_____/  |_|   \\__\\ \\_____/  /__/     \\_____/  |____|');
