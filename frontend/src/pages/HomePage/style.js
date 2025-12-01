import styled from "styled-components"
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'

export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: flex-start;
    padding: 16px 0;
    margin: 16px 0;
    overflow-x: auto;
    overflow-y: hidden;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    
    /* Custom scrollbar */
    &::-webkit-scrollbar {
        height: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #1a94ff 0%, #0d6efd 100%);
        border-radius: 10px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
        background: #0d6efd;
    }
    
    /* Smooth scrolling */
    scroll-behavior: smooth;
    
    /* Style cho các item TypeProduct bên trong */
    & > div {
        padding: 10px 20px;
        font-size: 16px;
        font-weight: 500;
        color: #333;
        border-radius: 8px;
        transition: all 0.3s ease;
        position: relative;
        white-space: nowrap;
        user-select: none;
        
        &:hover {
            background: linear-gradient(135deg, #1a94ff 0%, #0d6efd 100%);
            color: #fff;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(26, 148, 255, 0.3);
        }
        
        &:active {
            transform: translateY(0);
        }
        
        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 3px;
            background: linear-gradient(135deg, #1a94ff 0%, #0d6efd 100%);
            border-radius: 2px;
            transition: width 0.3s ease;
        }
        
        &:hover::after {
            width: 80%;
        }
    }
    
    @media (max-width: 768px) {
        gap: 8px;
        padding: 12px 0;
    }
`

export const WrapperButtonMore = styled(ButtonComponent)`
    &:hover {
        color: #fff;
        background: rgb(13, 92, 182);
        span{
            color: #fff;
            }
    }
    width: 100%;
    text-align: center;
    cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointers'}
   
`
export const WrapperProducts = styled.div`
    display: flex;
    gap: 14px;
    margin-top: 20px;
    flex-wrap: wrap;
`