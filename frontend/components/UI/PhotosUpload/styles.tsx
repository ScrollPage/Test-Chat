import styled from 'styled-components';

export const StyledPhotosUpload = styled.div`
    width: 100%;
    form {
        text-align: center;
        width: 100%;
    }
    label input {
        height: 0;
        width: 0;
        opacity: 0;
        pointer-events: none;
    }
    label {
        cursor: pointer;
        display: block;
        width: 30px;
        height: 30px;
        border: 2px solid #1890ff;
        border-radius: 50%;
        margin: 10px auto;
        line-height: 30px;
        color: #1890ff;
        font-weight: bold;
        font-size: 24px;
        display: flex;
        justify-content: center; 
        align-items: center;
        transition: all .2s ease;
        span {
          margin: 0;
          transform: translateY(-1.5px)
        }
    }
    label:hover {
        background: #1890ff;
        color: white;
    }
    .photos-upload {
        &__output {
            height: 40px;
            font-size: 0.8rem;  
            text-align: center;
        }
        &__error {
            color: red;
        }
    }
`;
