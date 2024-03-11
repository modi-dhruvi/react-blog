import React from 'react';
import { Container } from 'react-bootstrap'
import heart from '../heart.png'

const Footer = () => {
    return (
        // <>
        //     <footer className='footer fixed-bottom text-center py-2' style={{ overflowY: 'auto' }}>
        //         <Container>
        //             <div className="w-100 py-2" style={{ textAlign: 'center', fontSize: '15px' }}>
        //                 Designed with <img src={heart} /> by Dhruvi
        //             </div>
        //         </Container>
        //     </footer>
            // <footer className='footer' style={{ overflowY: 'auto', backgroundColor: 'white', position: 'fixed', bottom: '0', width: '100%' }}>
            <footer className='footer' style={{ overflowY: 'auto', backgroundColor: 'white' }}>
                <Container>
                    <div className="w-100 py-3 app-title-font" style={{ textAlign: 'center', fontSize: '15px' }}>
                        Designed with <img src={heart} alt="Heart icon" /> by Dhruvi
                    </div>
                </Container>
            </footer>
        // </>
    );
};

export default Footer;
