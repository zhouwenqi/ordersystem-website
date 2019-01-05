import React from 'react';
import { Form, Input, Button, Icon, Row, message, Checkbox } from 'antd';
import cookie from 'react-cookies';
import httpUtil from '../utils/HttpUtils';
import './loginPage.css';

const FormItem = Form.Item;
/**
 * 登录页面
 */
class LoginPageForm extends React.Component { 
    componentWillMount = () =>{
        if(cookie.load("chToken")!==undefined){
            this.props.history.push("/dash");
        }       
    }
    /**
     * 提交表单
     */
    handleSubmit = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err,values) => {
            if(!err) {
                this.login(values);
            }
        });
    }

    /**
     * 登录
     */
    login = (data) =>{       
        const params = {
            "params":data
        }
        const history =  this.props.history;
        httpUtil.get("/login",params).then(function(response){
            if(response === undefined || response==null){
                return;
            }
            if(!response.user.isEnabled){
                message.warning("帐号已被禁用");
                return;
            }
            window.config.token = response.token;
            cookie.save('chToken', response.token, { path: '/' }); 
            // 保存token到cookie
            if(data.autoLogin){
                cookie.save('chToken', response.token, { path: '/',maxAge:new Date().setDate(new Date().getDate()+30) });  
            }            
            history.push('/dash');
        });
    }
    
    forgotPassword = ()=>{
        message.info("请联系管理员");
    }
    render(){
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="login-layout-container">
                <div className="login-layout-nav"></div>
                <div className="login-layout-content">
                    <div className="login-layout-top">
                        <div className="login-layout-top-header">
                            <a href="/">
                                <img alt="logo" className="login-layout-top-logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZcAAACICAYAAAArkab3AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAJehJREFUeNrsnd9vG1l25281+l3M07Rl2WRnZnqCDDaikSADZNDLUvwDCLCA2A8BJi+rEgIkg5lMTAM7wOZJ1F/Q1NsmL6L+AlPIAgvIrVERvZN0etRtMj+AzSaIirZsTz+FRKbb7V+snEOdssulurfqVt2iSPl8gQIpsaruj7p1Pvfcn5bv+4LFYrFYLJN6i7OAxWKxWAwXFovFYjFcWCwWi8VwYbFYLBaL4cJisVgshguLxWKxGC4sFovFYjFcWCwWi8VwYbFYLBbDhcVisVisFHr7vCXoixsXbPqKnx4evhC9d/YeDflxs1gs1nRknYe1xQAoFfhowlGHYyH8m//y0+rC9/bi3sM2P3YWi8ViuKigUiKo3Iz7PQQW+u6LsW/14btz6c7DHj9+FovFmhO4gMGvwgcaffQmPDy+sffIKwgsLhzLGmCZfIfP0ViIxrsfPWgXFK8gD1BDSL/LRU2tP/nhn5bI86zSESeXypT7V//rL72Ye9jipDn01HVwvpsyHk3JT23NMNPIg3u2Y+7p0PtzSnB+UyNPY+8ju4ci3Nz5pxPvFM8C1YF79gyVveAZxj1Hj8pdbJljyWWszwWMqkNeRDlq5B/dWBz4wm8u7j1qGworD1gEgGUBPrf//9Wl3nv7xz1DcapQ+teicfnljQsQprUDIG9evPOIC+jrLzaCpBHNN4lqoetWYgweGocNBZjSaCMBbEIjzCR1EVox/3fCaY3kl46hlt2nqXm+ifxrZigXqnytUHzzVGYadCwklLk1umYH08GQSafco8XQ0MOBBW87DiwnBt4vozG/d32x4127WDIQ72YOsEw+X0w+hftPK5dKBvIAC3kvDiyoMcbF99fgsze4drHOxe7k5YajBV/vpgQLi4w3Gd7zrkbC7/UcZa9K7+tGAliiwnJ6lOBRsUzBhWo0tTgjT2AJG/XVF76Vq4mIRoPp9LHIwCIgLgvPhd/KGZ86gXVBAZbJJ4S9AGHf/perS4UCBr0ozCc6Zs4QUa3RlT1HVqLab0Aak96RBShH9Qxlz6EKTTkn4NtcDAuECxiuWA9CAhY05uI5nA/eQh7yNwyBBeLii+e+tfZ3tculjOkvxb3oErBMwp6E64v2P6wslUw/zJAXeQTHAR4Ql7sP4X/H1xdnAjIhsCzz65dZy5CPjfOaOIJGGo/C0byvTRVBE1ojz5tlGi5kWBuaYBHPx5Z45vuNT2v6zVEU5qpBsEyOZ35mF7uR0mMJgwWPhae+ZdQ4hPqhauG4UNprkE4XPKbKDJS5TgqwDODA9u3N0IH9E6M5ercGFGfVkae/rwnGrXJO7VJaaKxSZSVtpaaT4plthcpcP+H8mwQsVozydOjHzilJARYBhnXh6diqZ3DvqwWABT+zxOXUS5ASLJh+CNfCa5sGn2UrbLRDYKF0TvIc03hmLwPVtmuKU/BlbqhGJlGtdh5q7e0sI6Q0tEBl9lwZN4LAasxPu5L/p313WwpvCCstDjyvTgzA7ei7FX3OQjKyjz2X7KpmBIsAIyeeCCvLA7ELAAvER2T1osoZwYJ5UDb8LOsKsEzy/PFY1D5+/3LpDI2GytjuwMtdTRryigYADjvt0Nhzrto5bB6rK4x4Ji+HPLw1BVjsGLAE5c0luzOQXF/O0vfDcEkJlwxgEV+PrVw1LoNgEU8NpF8TLJB+If769yoma50LCWCBwxK/GlvVMzQasprjLrzEDr+O3Dwm8UoHZPwHEsBWMtzz5W9J82Xg92ECxLjsGoZLHrCgcR3mCdMkWJ5BfPLGRRcsT+D7lznyQBaXBLCI0QvrrMpaPePLz3qlTUXz2HloEqtImp8CL7WToWypfh/ETWJVeDD9NC0qrPxwcXOABY1dls7MYRFg+TrDIgU46z4nWMQPPvGMLUEDwfRTgGUEYZ5Vc9KqojnM41cxlVqK2vt5aJqReQCdrE1j1Bxb1mxqE5rnL7whc4+0lLlDH1cazgEW8eULv5MhTLcIsHydDXQoMOjWchawfPXC2jX5IOGWLZyoqvJYhs/FmQydTHjxOlOIAs5L2Ji2oUwxkqihuYRJlQzpQZzhw5o/NeHMa/7FQWIU9IdgXkE8BjGwwKHZVUleqsqebkVL9azOpC/zXHou7+w96gBYBhnB0v/TQ/1aO4SJQBsZBot4MvYz1eYBKK2MYBFf+b7RpgxcWgfSt6MAy84PD73mGZUz1Yt3Xr0WNIC1hEPbIFHzzNZ5ax4jEJdTVD5cXe8lIywYLmfYLIYG1ckAFvEf4+xzPPxJ04BRsAzA6GaqPePy/QCWbgawdP8sY5gqVT564EB4HwBYdkNg6QJY1iGNziwWQFOLD75hakqax1bnuHksqUksydOVpdtWlL2hZlkdJniVLFNwWbrz0AXDuq4JlvX/8fmRmz1UH5t/RobAAt+tXLV5CLsOYfc1wNL/1QurMAPw3YP7nd/p3q+///E96w9+PrB+8IlnA1jaXNTPjxJGL7XTTiycMdVVTWKhtOPfcZNpy2fc7+FxyTQIF6ottwEsHwBYRglgGQFYPgCw5DJ0i3uPsFPfMQSW3cZn+eJT/ujBEMK1ASq7KcCyC2Cx/+fdI94V8/XmEFa25rFdSfNYa87KgCPih6l3UnozgeJaRFxFuFXNeFYYLullZMn97+wfd3r2UgUMKzbL1AEsNQLLCEeFYec9gKUNYDFiVC/dedg5unZxC8ByMwdY+o/HvpGmom/vH2O66p/Zl+xnJ3lgQ9rLBJY+gKWHfSx/dnhmI7VmWZUphIFLyaStRBxMMcy8TYIOGbWoYV4zvLBi0fknbdKCdLgaZaaeoezpDqiQiSuMRcBlkuvuxMC2plVrevejBw3cjwU4sZ0BLF0AS/0v7npGC8Rvu/ddoT8C5U2Ql2Ag20WHr7HZ1dTDzOG9DKnWfzvm57bB2nRh+adY7mXSMCD0Vi+erJQcaUrrJUBNp+/TVjwL7juM6K15jvx7+8dtAMsVAEs3JVhGAJZbjc+ObNNgYSmNIBo52fIZNW4ay5W3aBx3JYa5NgdJcAzfrx4FsKLs1TUXvpTFdZdL4jmDC+q7B/d7ywfHNgDlCoBlCz67EbAMACy7ABYcMVUCsPAy2WcjVc23Naed0LNkoEdzHHeTWospSzLvRKd/qinkyxd1uAie1tvnJSHf695Dt5SXEZld4UssWzwQl/xwqUnDS1GLRIPEe5qHaueK5rGZlWK5FxPeSztS9m4qYOSpVrCmvJVdP2K4nHO4sGbeAOLsatmy6QFgjmif8na4jZ9qolUyGnhgk8+K4BE64fztJOTvLEpWGcQhyImeLKS3J4HTa3DBSgicu6UAxEawtH64vya0vYOqebFZ0KoIDBcWS9OY2EK9y+Aa1SbnPa1pl0xZMdjx74j40WOzKtnorrSeAALkw5j/r9JSOOHKR5PKnsxTmqyaoFnuuhAGN7NL9BZnAWuKtWtPCMF7XxSXv0NhdgO6wqRY7kUHLm5acIUmnprqm+pzWWa4sGbLAKJB+EDMbwf0rOcv1qS7cxBVR/L/kWzjrpi0YrPYIO396XxbcY0OWGxuDmO4sGbPAKLxqM6JEZxHmayhF6W8TWJJ5y/HzagnwGDZ28kY703aMZXBwnBhzShgcIQO1iJX6EVPYwxHdO4HvM2xOm/FDDePKZZ7Qek+17YuwBAMtPPpu1SekjwZ/B03antXNaqM9bosXDL+vOmLGxfs0J+9b+w94lrGHIhqmhXJzz2uLbLOoOxxuXuT4QIwCTZRCoapvib/pMbr+sLqXNh72ObHzmKxWHMIl7DngNsBFwwV7MCUjkOP2RYZNzhrLt0pDjIQr3AtiD0nFovFcMlhTAPPYTnGuPfRa4Dv7cW9h54hA45zJj5UnRMDlskS/aixELu+bzm4ZL6h+ATpX5V4TpB+qw2ek8vFjsViMVySjWoTPjZSGvcRGPcWeA3NnGGi17GWAyzCP9kPpj/2hf3N/eyAIS8N41NOjsckDl3cj+bSHTOQZbFYrHMFFzCquDyDKyQzXmXGnXaQ7INht9/N4DWoYKYJlsk+MGNxEpfvnOzJYjQuMWCZ/A/+BsgKp/LRg8LWJAo1TXKzHIvFmg+45ARLsINk/wUY9fc0jDoZzAODYJl8f+GLrd/82XFDMw+yguVl2BDuyrf3j12DQHHEyRIr0abJATbJQTxaiwwaFos1BWWd59LOCRbcmngZjGw7Q7imwYLHzZ69ZGsY8boBsGD4nX/6/aWKAahU4cDJYdsxYMFwyxCPDYhH7971i1Uu9iwWa+bgQoZ1NSdYgq2JV/sr6Yw61crLBYDl5BBWU8NraxkAi3juiwX4nmvhOxpMEetF+pF4QNhlCM/916tLDBgWizVznkvTEFiCrYmbKcNtFAgW/Kz9Te1yGi+iLtJ33qvAQuFbq5/WLuXxXrDfZiEFWILwFp7DNf+4ssSbc7FYrNmAC80rWTYIFjxq//e/qo06eQtazXCaYIH4QFzGVppVThsGwXKyLbOwMm1yRt5cGo/lZXjPMfyxKD/zLd5YjcVizYznYhsGS7DnfZJRr04BLGh47SyQywkWDNvO+PzqGcAC4VriqW98e1kWi8XKDJdqAWART8ciqVkoNdRygEU8G4uSTvoNgUU8y77V62pGsECeW+U73y9X+BVgsVhFSHcnykoBYBFPJZ6JTAWBBY18jnhkBsskD/JKEyziazienDxPj1+D7KJNr8IVIBzq3aPvvOhh+nwMtrKuhOyMi/lJy+TPS/xLoUpoj+LvTqkMBuEHeYfyIjtyzixcigALGHZrFsCSIx75wPLUt3I9xIxgEY9fWNN68bDwHxi+7WZ4+XMIA1+mmol7pTAi2BzppAkPzsfl2ltx2+HCb7JJZqm2Plbka5e2M4i7RpZPuERRJS0MJXGXhiu5R4XyEY+4QTIbdB5+7FI+uhr3l6XVyNbSobJwam5Z5Lwg/h0It20oXIfClpXBjZjw3XA5pK0PtiXXJz7LhPd6XbdZzCsCLF/7opfWiBYJlieZ4pEfLE9yeC55wPLlmL0WzZe6QZ7etgbIymI+tsPFEYftKeYlwvyIjGA5xSXYBHyAwIjbBOwMykI9VBaWU8Z/G67zQp6GNlQo3zDcDzUrU6sishYjgU62l00tRT47kv8P8N5acPHJ3TcMFjR4SUbOnQJY0Pgm1dp6RYAF0t/PCJbdHGAZOJ96DJf0L7VLL+fCOU7qKhnNovOyJxKWcFIIDWoP7lE9w/KARvl2xrJQJkg6mmFWqalrw3AZbGb5jcCzprpO13NxCwALGFi/kwVqhsGCRljpKtMaXX3DYIF88DO56CcrTWcCi/hqbLUFK20TRJ4mt3lTm9JcZF4u57wVGlf3LABDYFkzcKvttIAJgWXZdHoSvJe6oiwovRZtuLyz9whr7n3DYOn+8FBdg4Zwh2BI+wWDBb8nLiQJ8WgZBguGm2mWPm58drIIqDZYBvDZEqxUFaoiXuoZbx4rqmx0DOZlAJipTQamJqk1g7fcTgIkeQhuSm+lGzoGGvFoKvLYkVQSGkn3ytCh7zfBoN02BBb4nm6Gvj8p8P52gWDp/vjwKLGZCA368fXFJlxSNgSWnZ8cZm+egrDrEF6PZt6nAcsIPus//fxoaqOYqPPUUrxAuTq2E7SZdd9zMiYqYzgiQ9yJjmiidvW6mI/+lqjWsIZucpQT1dJrCYYRO+w7kRp7Q2HQAxA6RWcIxUXVlDcgw9oJBkWEBiw0FHDA9FYSgLygk2+KcliWeS9U1uN+b8RUNuqSOHXDAxa0l39Z3HuEm37tGgLLbuOzIzdduJNa+qAgsGAcUxsgOL1hCCwj+N7MU+gv33ngQXhVSF8/pcdiA1h6gpVkTCoJxgRH3+DoqmbcUFk0zHA04KgIIZpzmAWmm8dU3tAOjkyKGkjMVzjQOK8ngLAyhfxQxh+OKhrW8Gg7HAJMFRubKiJxKsuax2gAiapysx6Xb4pyuJ7BeynH9MM109wj06rIYOSdk422coGl/3js69Y4nILAsnXr83SQQ12687ADYW/mBAt+Rw/Cy1vqv7V/7P3G/nEVwLIOaerHgKUPYLkFn1UGS+6mgsAY1tMO2y16nkNBKpuCIhlPWe17lwCiyj+sDW8qTil0KSOCl8zrwsE4DVVZoMpHPUP8GwlgaWu2ILQTfhskxYM8obLEa3FzwwW3Bgaw2C9OdnLMChb7L+56Wk0zS3ceugCWTcNg6YOx136JKh89aEI4t3J4LCs/1QBaGl1x77e/171fff/jexaA5QqAZeUPP/Es51Ov+qPDo9Y0m8LOgeqK5o/zti5bX1Kzvpl12GzKvBxpNGm1FLX/opseVXFspKlkkOHtSn5ejnqJ5C2UFZWbdgHplNnB8LDkZtprs+7nIr65fzx8D2rLYFA3ASyjlGAZAVg2G58dVXXBEgJbE8CyYxAsdta4fHv/uAVgWYEwBxpg6cL3qmmwRPXffj7oAVhcwcpSU7UVNe3mOZx1v6wApgkjtir5f0fD+xsq4lIuuGNfBtiBplfa1gijntGrzqwE76Wp8OC6cfnwdt4IfffgfvMz+xIYWcsB4+rA53IMWPoAljaApQ1gyf1ifnP/gfPPV5dcMOrbOcCyC8beyQqWl+n/2WQnycqntUsOhF3HRSghzIUIWAY43BjCbf/kkA3+lGVTZ6XqpWqmNCYTgziFODspPYaKScMi6XRHw93MMSiiajAv8d25KfktGK5bhGqG4o/nbyvi34n8LSSG3Cuw7KGH+KHEO+zpwO5tE7H5bff+kCI16fT6398vV8GglwAswz/6xCukjf87+8ftf1iZAKYNYKlpgGUAhr9x6/Mjo0bid7v320HN5P98v1wBsFQILL3//ik3R52haiJ5jkozpdHuT8lrWTujvHLIgES9tg2ARCfjGl8qj0LXSHoZwylKWvmBZYeWYknrTcoAGwdwneHjDcWzbNP7EC0DCxKIdGXe29tF5Dg2yUzjyf6Xg2MsbDZ4DVUAi4NeA4BlOQYsI5wgiZ7Djw+PCq95/sHPB57gBSHnWTK4nOtKAtaIycv7UGJ0qgbzUujCCs9XGOdqEV5lggeZ5R3vinwTcocSsOrcs5QAQARV3EjJhbReS2FwmbbAa8BC+rLNOPCcCCzsObBY6Q14izqTo8ZqOWPzWIVz9ey8pYxqCfXcnESvBfXWecx99Jw++FvP/cEnnstgYbG05Yj4kVkbGZZc8RRegcmmrHkZYp83zfYUKhhBN0eSlBWNt/k9Yp1zYTOEa+he01rLCocGp6kUSbf/zmlcPEXTSEvTwHkJ+Zn62SQ0URVSicSauaIpzs5QtuZlKaEk76WbNFKO4cI673IzNOXgSxPXhr2ANfcpbF7VyLmfiwmj2qTmsagxrNHM8bQamoJLAtzPwnPRqmwkeH3R+OOQ4Lh5LvUYjwGvXYk59yDH81f1vSR6LQwXFku/to2G1XlD8gHTeTeLYQkZKeyEH0lqwHHrVqkkndha8Cg+WSc8blFQ0gjb0YBLTwIX7PuqhIcjU/huDMxyV8xkcElT+XmL7QiLFftSybR2lnuJTFPkocUtu7JgKD/LGsvO28LcfBNdqe7fTBn/kgIu/Zi5K6ow52JFc4YLi3XaqHpCvlTHxFjqAGaay8IXkBdoPPs5b9NWGcoUy86XztjYqsK+mQTI0D42CxrxV4W5qtk0yXBhsWZIqhppsJdIUwUONJq0uVRnzvPCyXMxrdrbT8jLusJj8YR64UtvCpWNHcUp27JVIEL7scg68gdx64RRU5cqzA9xYussbPks07npc/nixgUshFhA7ciDHNBOlh3cufHC3kMemvxmKe1SKq/NWqZRQqoJb2jssD16g85zQ79heNWQQezOuSeH/SabIvvWxJP8FfIOZsyn2xDGgPIRjXlJKPYgIY1EtkVE0VtKs9ikHYl/XQG5DfImOqH42yJ5dFgj4TdVmKvkxeD2D1h2h+LVUOcz30do7uECUAmWPog1Av5J4cSNvVZ94bdwo6+lOw95F8Y3R+UEAxUozgOpJ9SaA6VZYmaupRg9lvZ6hPUtET/7P/ysdJa+cTJ6LcsZ4j+k9B8keLQ68d9K2ItlSBWjuwn3WRXyxUHPTHPdLAZgaVDGy8BCny/3vF+A/3147/pF17t2sSRYrASDItQbPb1pauTMT6zUbRmKy7rKMBdUHtCrWjd0O1w2v5EizB6FOXdl0BhcwNBX4GjC4cLh0zH8Jfz96Mai8/DGBaPGHO7dUtWCYsAS3vO+NhaW+y9Xl0zHqQ5HBw4vlAc9yIM25EGVbdNcAgZfbnx2Xc6LiXHdynmPRk5jiU1nKwXtZ5Im/hjuFaG3R31YmO5bSRukxYSJlZy+gSRg+FPpGjACF/Ig8CXcCHsRYMzBU7BqYNy3wbj37l9ftE0ZcSFfejsJLMHWxMtjQx2tBFZ88W6Te1oOxWUZwl2DeNw9vr7YAq+JPab5M6oetb+vZ3jB8WV2z1F2NHMY1rCxRGDvaEAGz8N+n+pZ7+wZqnBsakIy2A65lSVMOKoZy6Cga7BZsjKFScAT5e5zAaOKBWUtzsBHjHsZPg/+7drS+q9/dNzOER4a53ZOsARbE9f+fmXJ+a2DXPEJZhkvJOUBhH0Twrb/9eqS/a39Yx5Y8Eorkv/rvARYwckD7l6KFxzLSZuGztpkYCoxp3p0uAmGMG+6ZTOzh0XlU6gfoKIZ7ilgi5PBFqVQXsZVPjH/ehmbwPKWCWU+EGiblB+2JP49SoNrYqJnqAxWQvlWlTyLXnBk7JvqKcpooizf9/OABV277RRgmXzihl5g0Edw2L/5s+NexjCbQjJqRRMswdbEgyvu/UoO0GHBWU4BlpdbIT+HGsxv7B87gsVisc6pMjeLkWFtaYIFj4Vnfq5JTw2DYMGtict/U7tczxEXXbCI52Oxdte+ZHPxY7FYDJfTOjX+OgVYJvvMPxtbtb+tXdL2FqgJasEgWILdK7MaeicDWCDcya6Y7LmwWCyGS4zsjGCZ7BL5JJtBtwsAC8ZHeyQXduKLyPwJDbDgJmbsubBYLIZLjCo5wIJ7y1cyhFkqACxg6POlPwNYMP1lLn4sFovhIlFGsEyOvOGaAstT3zKaBynAIp5w2WOxWAwX82B57OcL1yRYnozN5UFasDx+YXHpY7FYDJcYo+rmActXLyw3Q7BuEWCBOGmPP//G3iM3D1i+HPOMbxaLxXCJgYvVzgGWwR//4sjVD/NkcplhsIivfb+TMQ92MoJFfDW22lz8WCwWwyWiC3sPPTCqOxnAIr70/WaWMN/ZezQEg75rGCziiS8ywsVvZgTL4EeHRwwXFovFcJF4Eg0wrn1NsOz8+aHXzh6m3zIMlq2fHHqZlmVY3HvkQdjrmmAZwWedix6LxWK4SHTpzsMhgMUGg97XAIuTJ8zFk76OLUNgGcH3Zp74XL7zoA3hrWuAxf7p50c9LnosFovhotCvf3Q8fG//uArGfB3AMpCApQtgWckLllfei9UEsPRzggW/o6HPvZjct/aP2wCWdwEsOxKwjAAsm/BZYbCwWKw3QbkWroyT+/7lKhjWUggs3h//4sgzHfF/u7ZUApi4wIvljB6LA4be+GZDH79/GdNeDXsszqeey0Xt7EWrGaddJRcrHVhutVZvyLIcPMWrjrs9JpyHv4cXbe1GtuJNCsfXuRbOx7SEN+JbOevl7lnzI+PbHNsf35tKzRw9pn++uoRNck0Ay00NsHThe6MoD+L9j++hUeIXUG200KgdGLxlWiMr3Q477p7iZEl13XhaKUBSEa+WmH+5Xh78JpIAM6fPFvd4x32OtihP/51AzJO9GC6zqe+c7InSuGtfagFYmgCWOoBlQQKWXRwV9pMcgwlYrAzGtkkQQaAkLfmzgd5C4B3Ad0ec7MUxT02pwR4gLfreJqCg6iK0Vw2CiD0hhstM64p7H5sv8EUU+++XqwCWEoClCmDpEVh6f/ILjzfnml2NhN7GYELDA5FpR5zedA7L0JrhtGEYDRGzmneMcIfHKhjdHhnnNTLC60Vu60sbTzkxP1Wi+UOeyak0BptR0YZYLpw3aVZEeKBHRp5gjcIJPBkWw2V+dPXjQWCkuEbEUmktCSRUq7YiRvgodMoW7QmvuocH1yEoNhRAwd/dwEOJ6evYJgNdlCqK+EXzLE4YXy/h2iBNeKwzXBguLNY0tGDAE5mG7BiDmUatyPnhPgkvZk/1Bnk84Y3ocMdXrb3TqX9HtjFflSCG6hScb8FW4IHH0hExO9iyGC4slmnNbLNYjBcR1u2IRxE7miq033pwT5Hg7fSo+cmNAGZZM40lRdzDQC/Cy0dABk3R9ZBn08L8gPStpPB2WAwXFiuXsoywywuXxGYxU6JOfZkqkd8n/RdkgKOAGYl0fTe6cuNGqeUZihwehBC5xov5H4vhwmIVIhxFtXGO07ehkXY0uthPU6H+GjsE3o5mPiG0uxIgh71FHuzCYriwWDnUDhlq7AcIdyp3I96TF3N9XFPageE4lshjwD6ROo22sum3hs6NyHuwQ55IeBJlT2cCJovFcGHNtGjEFWrF8H3RUHrBkNjIb444PdQ2OlO/GnNd9H9474p4NUS3XUAW3Q6DKzwMucgRYwl9S+H4hP/uMqBYDBfWrAiNfFFNYJsi1HEeUiWF4Uw7Ys0Rmh3h4ZnoNIdlOc5AE8yw6Ss82XKbZu4bB9mcTtJkMVxYLFaM17Ys8bqGNEosGLa7HAGM6X6RYM7JQJyeLMliMVxYc6+uMDcUVnafdsYw0KC3DKa1ITHy2G8zouVQZMOQc8EF+28kP5VptBrmkSdejaDri9PzX+qROHlcfFkMF9asyiUj5eS8T1s2vJX6YbyU/QovoYfNVab6OeA+pYQ0YrNcmwATHYZ8K9KxrxNmg8KVrWs2Eq+GgocnNqI306I5OsH9ovHvcPFlMVxYs6yKyD9vxZ3xNKZZX2yZ0lENAaYRM4P/Zb6R14H554XnqpCnclsR1oi8spcAgWu6oeeAcW0G3haBJQyoEVzHcGG9GXD54saFKrnu4Rqe50MN6529R/wizLb3Mu17TGvhyrAHESdsfiqFDPcy9bsMCRrDyMrKYYXnyHQj3lonAouoejETJ/Hv8NDqm3CPNnmWUcC1uNiyzj1cAColMhSnFsMDsNR8Ya09vHFhMPYtZ+nOQ5cf+0xpQ5gZPbZBo6rS7hFSEafXCqsUlMa2wmsZEnjCRv1uhjDiNjULll3BsAciYcl/anrbiQDWDd0j6vWwWFK9Ne8JIG/Fk4AFt0SGwxcAlvJYWAdH1y46/NhZVKPfiBy1lNfpeC2OOD1Z85RRFycbae3kSM9CzH2HBFCcK5MWnA2CR/i+0RFuzXBfDIs1FbiAsXfg6MDh4ucv4e+CPZZO3IsVAYsAsARbIW//v6tLdX70Z6ZoDRtr1NHVfkcifgXgARnn8BGoH2e4DStabrwEsMStStyUeA0NoTkDn9KMk1F/Teax4egznTkyBA3V+9FV9AGxWObhgoYeDpyMtU01tRrY8tUx/H18fbHnXbtYKiD+zThXXwEW8Rx+ez5ml36G4OLEGFU0iNWYmnxQmajTZyXyWyNFeRmRl/CuOJl0GdZKTJhtOm8zpgbfI6Ct0BGdjDik60chw+wmGPYAkrsU5i26d1x8cW6MW4AXUYl4L68BlfqQWCylTPa5uOGXDw38GA806L61/My3XBHfLpzHa3EygEVAXMp/V7vkfK97v81FYHqi0U/lGANdlRhbh2r/y6Emmg/pEDFeRJKRbdE9blLZiVYyMH5Bf0MNO9KDTm/q2I4qmNWP5zhRI09DoBvUId8UKZaLIajK8i9P3ldSPp+mUDf9Yf7UKT9accvtsFjG4PLFSdOXDCxozMXTsbV8WLtU/53ufVOjtqoi0hyWEiziKfwP4lMXxawNxVIb99eadWjI7amac2ROSl+o9zLZFJE5GTGGsx25R1NEOvQRJGRgg3AbFI9W5Nro0vd4Pk5+dOKG51K8GtPO7ND2xUMhmWND59QpfuWUtw4AjaPJ+lSxZNCwXpOpZjE7ASziMfzz8diyDcbdzgEW8fXYYtd+uoauFQOIVtyzJCNXizQvfaBoqsHO+H+HMCYTJaO1dPi7IU4PMUZjG7fVrhMCCIZ7EIl3n5qNovFZmLXKSuA5kacXzftgUmaPfi8rwI1NcrL+rGXKM36fWIXApZICLOJXY6taRCIygEU84Wc/7Rr0zci/B6GO5qRafYlqxxUydjLIoIFsh2vQ1D+AxyAEjW6MsR2EDPKvSWryCJbJDHryUGzx+sCDWezLc2X/p/4fW5KfmEdX0JujzcvwvPVQPr5W0ePFL1lFwaWXAixi9MJyZwUsj19Y/PSnW4NGg70V4yGgOjGGfoe8AxwJVSWDPqQ+kAoZuuiIsq3oyKjgGhqK+wFBI65pthG5pi1edaCj8d0M4hE6L9gvpTvDcIkz+reCgQWUhmboN8x33HHyFDAwTygf10Np3mSwsOJk+b6f+ya/vHHBBht+kAAWMXwurvzw0DNSEL+AMCHmB1nB8uVY7Difeg4Xgal7Mdi+XwpDgDybIzJsLR1jRZ4JGviqSOh3iVxTDXlFPVl/Ac1T6STdlzb26qSMc9iYe2mHClMzlq17bWRNsl5cWtKmM8YjHfKcF1ZhcEEdX19sA1jWFGDZAbAYNeaPbix6AJZyBrCIr8bWyo8Oj1wuAjMDnRIbKRbr/MjYPBcASwOM+Y4ELFumwYICsLQygqXLYJktMVhYLPZclDqsXaoCWOoEliGApQNg8YpKwL3rF10AS00DLCP4tH/6+RG3E7NYLNa8wGXaOrp2sQRg6QBYagwWFovFYrgY1T+uLDUBLA0Ay4IELDvw2QSwePzYWSwWi+GipY/fv1wHsFRDYPEALO6PDhkqLBaLxXBhsVgs1tzqLc4CFovFYjFcWCwWi8VwYbFYLBbDhcVisVgshguLxWKxGC4sFovFYriwWCwWi6Wv/xRgAPNXzIvohA7nAAAAAElFTkSuQmCC" />                              
                                
                            </a>                            
                        </div>
                        <div className="login-layout-top-desc">订单在线管理系统V1.0</div>
                    </div>                    
                    <div className="login-layout-form">                        
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem hasFeedback className="login-form-item">
                                {getFieldDecorator('uid',{
                                    rules:[{required:true,message:'请输入登录帐号!'}],
                                })(<Input size="large" type="text" placeholder="帐号(手机号)" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} />)}                                                            
                            </FormItem>
                            <FormItem hasFeedback  className="login-form-item-bottom">
                               {getFieldDecorator('pwd',{rules:[{required:true,message:'请输入登录密码!'}],
                            })(<Input size="large" type="password" placeholder="登录密码" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} />)}                            
                            </FormItem>
                            <FormItem  className="login-form-item">
                                <Row>
                                {getFieldDecorator('autoLogin',{
                                    rules:[{required:false}],
                                })(<Checkbox>自动登录</Checkbox>)}                                      
                                    <a href="javascript:;" className="login-form-forgot" onClick={this.forgotPassword}>找回密码</a>   
                                </Row>
                                <Row>
                                    <Button htmlType="submit" size="large" type="primary" block>登录</Button>  
                                </Row>                                                          
                            </FormItem>
                        </Form>
                    </div> 
                                  
                </div>
                <footer className="login-layout-footer">
                    <div className="ogin-layout-footer-copyrigyt">Copyright &copy; 2018 晨颢科技</div>
                </footer>                 
            </div>
        );
    }
}
const LoginPage = Form.create()(LoginPageForm);
export default LoginPage;