import { Dialog } from 'quasar';
import { theme } from 'src/boot/helpers';
import type {
    IQuestionProps,
} from 'src/components/dialogs/QuestionDialog.vue';
import QuestionDialog from 'src/components/dialogs/QuestionDialog.vue';
import type { IQuestionWithAnswerProps } from 'src/components/dialogs/QuestionWithAnswer.vue';
import QuestionWithAnswer from 'src/components/dialogs/QuestionWithAnswer.vue';

export const question = (
    title: string,
    message?: string,
    config?: IQuestionProps,
): Promise<boolean> => {
    return new Promise((resolve) => {
        Dialog.create({
            componentProps: {
                title,
                message,
                type: 'info',
                icon: 'sym_o_help',
                ok: {
                    ...theme.btn,
                    label: 'Aceptar',
                    color: 'positive',
                },
                cancel: {
                    ...theme.btn,
                    outline: true,
                    label: 'Cancelar',
                    color: 'negative',
                },
                ...config,
            },
            component: QuestionDialog,
        })
            .onOk(() => {
                resolve(true);
            })
            .onCancel(() => {
                resolve(false);
            });
    });
};

export const questionWithAnswer = (
    title: string,
    message?: string,
    config?: IQuestionWithAnswerProps,
): Promise<{ answer: boolean; value: string | null }> => {
    return new Promise((resolve) => {
        Dialog.create({
            componentProps: {
                title,
                message,
                type: 'info',
                icon: 'sym_o_info',
                ok: {
                    ...theme.btn,
                    label: 'Aceptar',
                    color: 'positive',
                },
                cancel: {
                    ...theme.btn,
                    outline: true,
                    label: 'Cancelar',
                    color: 'negative',
                },
                ...config,
            },
            component: QuestionWithAnswer,
        })
            .onOk((answer) => {
                resolve({ answer: true, value: answer });
            })
            .onCancel(() => {
                resolve({ answer: false, value: null });
            });
    });
};

export const alert = (
    title: string,
    message?: string,
    config?: IQuestionProps,
): Promise<boolean> => {
    return new Promise((resolve) => {
        const iconOpts = {
            'positive': 'sym_o_check_circle',
            'negative': 'sym_o_error',
            'info': 'sym_o_info',
        }

        Dialog.create({
            componentProps: {
                title,
                message,
                type: 'info',
                icon: iconOpts[config?.type || 'info'],
                ok: {
                    ...theme.btn,
                    label: 'Aceptar',
                    color: config?.type || 'primary',
                },
                cancel: false,
                ...config,
            },
            component: QuestionDialog,
        })
            .onOk(() => {
                resolve(true);
            })
            .onCancel(() => {
                resolve(false);
            });
    });
};
