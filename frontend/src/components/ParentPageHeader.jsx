import React from 'react';
import { Container } from 'react-bootstrap';

const ParentPageHeader = ({ icon, title, subtitle }) => {
    return (
        <div className="parent-page-header">
            <Container>
                <div className="parent-header-content">
                    <h1 className="parent-page-title">
                        {icon}
                        {title}
                    </h1>
                    <p className="parent-page-subtitle">
                        {subtitle}
                    </p>
                </div>
            </Container>
        </div>
    );
};

export default ParentPageHeader; 
