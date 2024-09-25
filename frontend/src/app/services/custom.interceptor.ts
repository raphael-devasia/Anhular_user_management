import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  
    const token = req.url.includes('getallusers')
      ? localStorage.getItem('adminToken')
      : localStorage.getItem('jwt');
console.log(token);

  const colnedReq = req.clone({
    setHeaders:{
      Authorization:`Bearer ${token}`
    }
  })
  return next(colnedReq);
};
