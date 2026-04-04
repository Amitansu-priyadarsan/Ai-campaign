const Diamond = ({ className, fill = "#775A19", ...props }) => {
    return (
        <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
            <path d="M8.53125 6.5625L11.8438 0H12.2188L15.5312 6.5625H8.53125ZM11.0938 21.375L0.3125 8.4375H11.0938V21.375ZM12.9688 21.375V8.4375H23.75L12.9688 21.375ZM17.5938 6.5625L14.3438 0H20.7812L24.0625 6.5625H17.5938ZM0 6.5625L3.28125 0H9.71875L6.46875 6.5625H0Z" fill={fill} />
        </svg>

    )
}

export default Diamond