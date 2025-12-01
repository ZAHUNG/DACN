import React from 'react'
import { Row, Col } from 'antd'
import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  YoutubeOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined
} from '@ant-design/icons'
import {
  WrapperFooter,
  WrapperFooterTop,
  WrapperFooterBottom,
  FooterTitle,
  FooterText,
  FooterLink,
  FooterSection,
  SocialIcons,
  SocialIcon,
  FooterDivider
} from './style'

const FooterComponent = () => {
  return (
    <WrapperFooter>
      <WrapperFooterTop>
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} md={6}>
            <FooterSection>
              <FooterTitle>Về chúng tôi</FooterTitle>
              <FooterText>
                DOANCHUYENNGANH - Nền tảng mua sắm trực tuyến uy tín, 
                mang đến cho bạn những sản phẩm chất lượng với giá cả hợp lý.
              </FooterText>
              <SocialIcons>
                <SocialIcon href="#" target="_blank" rel="noopener noreferrer">
                  <FacebookOutlined />
                </SocialIcon>
                <SocialIcon href="#" target="_blank" rel="noopener noreferrer">
                  <InstagramOutlined />
                </SocialIcon>
                <SocialIcon href="#" target="_blank" rel="noopener noreferrer">
                  <TwitterOutlined />
                </SocialIcon>
                <SocialIcon href="#" target="_blank" rel="noopener noreferrer">
                  <YoutubeOutlined />
                </SocialIcon>
              </SocialIcons>
            </FooterSection>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <FooterSection>
              <FooterTitle>Thông tin</FooterTitle>
              <FooterLink href="/">Trang chủ</FooterLink>
              <FooterLink href="/products">Sản phẩm</FooterLink>
              <FooterLink href="/help">Hỗ trợ</FooterLink>
              <FooterLink href="/about">Giới thiệu</FooterLink>
              <FooterLink href="/contact">Liên hệ</FooterLink>
            </FooterSection>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <FooterSection>
              <FooterTitle>Chính sách</FooterTitle>
              <FooterLink href="/policy/privacy">Chính sách bảo mật</FooterLink>
              <FooterLink href="/policy/terms">Điều khoản sử dụng</FooterLink>
              <FooterLink href="/policy/return">Chính sách đổi trả</FooterLink>
              <FooterLink href="/policy/shipping">Chính sách vận chuyển</FooterLink>
              <FooterLink href="/policy/payment">Chính sách thanh toán</FooterLink>
            </FooterSection>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <FooterSection>
              <FooterTitle>Liên hệ</FooterTitle>
              <FooterText>
                <PhoneOutlined style={{ marginRight: '8px', color: '#fff' }} />
                0123 456 789
              </FooterText>
              <FooterText>
                <MailOutlined style={{ marginRight: '8px', color: '#fff' }} />
                support@cuahangdienthoai.com
              </FooterText>
              <FooterText>
                <EnvironmentOutlined style={{ marginRight: '8px', color: '#fff' }} />
                18 Cộng Hòa, Quận Tân Bình, TP.HCM
              </FooterText>
              <div style={{ marginTop: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                <iframe
                  title="Store Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.337878715983!2d106.63628791533411!3d10.790488261714963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175299bafc33a35%3A0x3c6c1ff8d1f4b5d!2s18%20Cong%20Hoa%2C%20Tan%20Binh%2C%20Ho%20Chi%20Minh%2C%20Vietnam!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                  width="100%"
                  height="150"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </FooterSection>
          </Col>
        </Row>
      </WrapperFooterTop>

      <FooterDivider />

      <WrapperFooterBottom>
        <Row justify="space-between" align="middle">
          <Col xs={24} sm={24} md={12}>
            <FooterText style={{ textAlign: 'left', margin: 0 }}>
              © 2025 DOANCHUYENNGANH.
            </FooterText>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <FooterText style={{ textAlign: 'right', margin: 0 }}>
              Được phát triển bởi Team DACN Nhóm 11
            </FooterText>
          </Col>
        </Row>
      </WrapperFooterBottom>
    </WrapperFooter>
  )
}

export default FooterComponent

