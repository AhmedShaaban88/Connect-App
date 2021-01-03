export default function isVideo( url ) {
    const ext =  url.split(/[#?]/)[0].split('.').pop().trim();
    return !!(ext.toLowerCase() === 'mp4' || ext.toLowerCase() === 'avi' || ext.toLowerCase() === 'mov' | ext.toLowerCase() === 'wmv');
}
