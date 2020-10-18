import { teamAddBlackList, teamAddStaff } from '@/store/actions/teams';
import { IParty, IPartyMember } from '@/types/party';
import { IPostUser } from '@/types/post';
import { Button } from 'antd';
import { Formik, useFormikContext } from 'formik';
import { Form, Select } from 'formik-antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';
import { object, string } from 'yup';
import { StyledPartyChangeMembers } from './styles';

const validationSchema = object().shape({
    members: string().required('Выберите стафф сообщества'),
});

interface IPartyChangeMembers {
    party: IParty;
    partyId: number | null;
}

const PartyChangeMembers: React.FC<IPartyChangeMembers> = ({
    party,
    partyId,
}) => {
    const { data } = useSWR(`/api/v1/group/${partyId}/`, {
        initialData: party,
    });

    return (
        <StyledPartyChangeMembers>
            {data && partyId && (
                <>
                    <MyFormik
                        members={data.members}
                        text={'Сделать стаффом'}
                        partyId={partyId}
                        func={teamAddStaff}
                        fl={false}
                    />
                    <hr />
                    <StaffFormik
                        staff={data.staff}
                        partyId={partyId}
                        func={teamAddStaff}
                        fl={true}
                    />
                    <hr />
                    <MyFormik
                        members={data.members}
                        text={'Добавить в черный список'}
                        partyId={partyId}
                        func={teamAddBlackList}
                        fl={false}
                    />
                    <hr />
                    <MyFormik
                        members={data.members}
                        text={'Убрать из черного списка'}
                        partyId={partyId}
                        func={teamAddBlackList}
                        fl={true}
                    />
                </>
            )}
        </StyledPartyChangeMembers>
    );
};

interface IMyFormik {
    members: IPartyMember[];
    text: string;
    partyId: number;
    fl: boolean;
    func: (staffId: number, partyId: number, isRemove?: boolean) => void;
}

const MyFormik: React.FC<IMyFormik> = ({
    members,
    text,
    func,
    partyId,
    fl,
}) => {
    const dispatch = useDispatch();

    return (
        <Formik
            validationSchema={validationSchema}
            initialValues={{
                members: '',
            }}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                setSubmitting(true);
                dispatch(func(Number(values.members), partyId, fl));
                setTimeout(() => {
                  setSubmitting(false);
                  resetForm({})
                }, 1000);
            }}
        >
            {() => (
                <Form>
                    <Form.Item name="members">
                        <MySelect members={members} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        {text}
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

interface IStaffFormik {
    staff: IPostUser[];
    partyId: number;
    fl: boolean;
    func: (staffId: number, partyId: number, isRemove?: boolean) => void;
}

interface StaffFormValues {
  members: string;
}

const StaffFormik: React.FC<IStaffFormik> = ({ staff, func, partyId, fl }) => {
  const dispatch = useDispatch();
  
    const initialValues: StaffFormValues = {
        members: '',
    };
    return (
        <Formik
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                setSubmitting(true);
                dispatch(func(Number(values.members), partyId, fl));
                setTimeout(() => {
                  setSubmitting(false);
                  resetForm({})
                }, 1000);
            }}
        >
            {({handleReset}) => (
                <Form onReset={handleReset} >
                    <Form.Item name="members">
                        <StaffSelect staff={staff} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Убрать из стаффа
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

interface IMySelect {
    members: IPartyMember[];
}

const MySelect: React.FC<IMySelect> = ({ members }) => {
    const { setFieldValue } = useFormikContext();

    return (
        <Select
            name="staff"
            style={{ width: '100%' }}
            placeholder="Выберите человека"
            onChange={value => setFieldValue('members', value)}
        >
            {members.map((member, index) => {
                const name = `${member.user.first_name} ${member.user.last_name}`;
                return (
                    <Select.Option
                        value={member.user.id}
                        key={`select-party-member__${name}__${index}`}
                    >
                        {name}
                    </Select.Option>
                );
            })}
        </Select>
    );
};

interface IStaffSelect {
    staff: IPostUser[];
}

const StaffSelect: React.FC<IStaffSelect> = ({ staff }) => {
    const { setFieldValue } = useFormikContext();
    return (
        <Select
            name="staff"
            style={{ width: '100%' }}
            placeholder="Выберите человека"
            onChange={value => setFieldValue('members', value)}
        >
            {staff.map((member, index) => {
                const name = `${member.first_name} ${member.last_name}`;
                return (
                    <Select.Option
                        value={member.id}
                        key={`select-party-member__${name}__${index}`}
                    >
                        {name}
                    </Select.Option>
                );
            })}
        </Select>
    );
};

export default PartyChangeMembers;
