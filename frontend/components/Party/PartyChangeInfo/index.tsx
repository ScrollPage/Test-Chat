import React from 'react';
import { Button, Tabs } from 'antd';
import { useDispatch } from 'react-redux';
import { teamChange } from '@/store/actions/teams';
import { Formik } from 'formik';
import { Input, Form } from 'formik-antd';
import { object, string } from 'yup';

interface MyFormValues {
    name: string;
    info: string;
}

const validationSchema = object().shape({
    name: string()
        .required('Введите название сообщества')
        .min(3, 'Слишком короткое название сообщества')
        .max(30, 'Слишком длинное название сообщества'),
    info: string()
        .required('Введите информацию о сообществе')
        .min(3, 'Слишком короткая информация о сообществе')
        .max(100, 'Слишком длинная информация о сообществе'),
});

interface IPartyChangeInfo {
  name: string;
  info: string;
  partyId: number | null;
}

const PartyChangeInfo: React.FC<IPartyChangeInfo> = ({name, info, partyId}) => {
    const dispatch = useDispatch();

    const initialValues: MyFormValues = { name: name, info: info };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true);
                if (partyId) {
                    dispatch(teamChange(values.name, values.info, partyId));
                }
                setTimeout(() => {
                    setSubmitting(false);
                }, 1000);
            }}
            validationSchema={validationSchema}
        >
            {() => (
                <Form>
                    <Form.Item name="name" label="Название сообщества">
                        <Input name="name" />
                    </Form.Item>
                    <Form.Item name="info" label="Информация о сообществе">
                        <Input.TextArea
                            name="info"
                            autoSize={{ minRows: 2, maxRows: 6 }}
                        />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Сменить
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default PartyChangeInfo;
