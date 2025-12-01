import styled from 'styled-components'

export const WrapperFooter = styled.footer`
  background: linear-gradient(135deg, #1a94ff 0%, #0d6efd 100%);
  color: #fff;
  width: 100%;
  margin-top: auto;
`

export const WrapperFooterTop = styled.div`
  padding: 48px 24px 32px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 32px 16px 24px;
  }
`

export const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const FooterTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 16px 0;
  position: relative;
  padding-bottom: 12px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background: #fff;
    border-radius: 2px;
  }
`

export const FooterText = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin: 8px 0;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #fff;
  }
`

export const FooterLink = styled.a`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  margin: 8px 0;
  transition: all 0.3s ease;
  display: inline-block;
  
  &:hover {
    color: #fff;
    padding-left: 8px;
    transform: translateX(4px);
  }
`

export const SocialIcons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`

export const SocialIcon = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  transition: all 0.3s ease;
  text-decoration: none;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`

export const FooterDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 24px;
  
  @media (max-width: 768px) {
    margin: 0 16px;
  }
`

export const WrapperFooterBottom = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 16px;
    text-align: center;
  }
`

