import { SendIcon } from "../assets/icons";
import { Button, Input, Section } from "../components/Elements";

export default function About() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(5, auto)", alignItems: 'center' }}>
                {/* Default color */}
                <Button type="solid" fontSize="xl" color="default" icon={<SendIcon />}>Solid XL Default</Button>
                <Button type="outlined" fontSize="lg" color="default" icon={<SendIcon />}>Outlined LG Default</Button>
                <Button type="dashed" fontSize="md" color="default" icon={<SendIcon />}>Dashed MD Default</Button>
                <Button type="filled" fontSize="ms" color="default" icon={<SendIcon />}>Filled MS Default</Button>
                <Button type="text" fontSize="sm" color="default" icon={<SendIcon />}>Text SM Default</Button>
            
                {/* Primary color */}
                <Button type="solid" fontSize="xl" color="primary" icon={<SendIcon />}>Solid XL Primary</Button>
                <Button type="outlined" fontSize="lg" color="primary" icon={<SendIcon />}>Outlined LG Primary</Button>
                <Button type="dashed" fontSize="md" color="primary" icon={<SendIcon />}>Dashed MD Primary</Button>
                <Button type="filled" fontSize="ms" color="primary" icon={<SendIcon />}>Filled MS Primary</Button>
                <Button type="text" fontSize="sm" color="primary" icon={<SendIcon />}>Text SM Primary</Button>
            
                {/* Info color */}
                <Button type="solid" fontSize="xl" color="info" icon={<SendIcon />}>Solid XL Info</Button>
                <Button type="outlined" fontSize="lg" color="info" icon={<SendIcon />}>Outlined LG Info</Button>
                <Button type="dashed" fontSize="md" color="info" icon={<SendIcon />}>Dashed MD Info</Button>
                <Button type="filled" fontSize="ms" color="info" icon={<SendIcon />}>Filled MS Info</Button>
                <Button type="text" fontSize="sm" color="info" icon={<SendIcon />}>Text SM Info</Button>
            
                {/* Warning color */}
                <Button type="solid" fontSize="xl" color="warning" icon={<SendIcon />}>Solid XL Warning</Button>
                <Button type="outlined" fontSize="lg" color="warning" icon={<SendIcon />}>Outlined LG Warning</Button>
                <Button type="dashed" fontSize="md" color="warning" icon={<SendIcon />}>Dashed MD Warning</Button>
                <Button type="filled" fontSize="ms" color="warning" icon={<SendIcon />}>Filled MS Warning</Button>
                <Button type="text" fontSize="sm" color="warning" icon={<SendIcon />}>Text SM Warning</Button>
            
                {/* Error color */}
                <Button type="solid" fontSize="xl" color="error" icon={<SendIcon />}>Solid XL Error</Button>
                <Button type="outlined" fontSize="lg" color="error" icon={<SendIcon />}>Outlined LG Error</Button>
                <Button type="dashed" fontSize="md" color="error" icon={<SendIcon />}>Dashed MD Error</Button>
                <Button type="filled" fontSize="ms" color="error" icon={<SendIcon />}>Filled MS Error</Button>
                <Button type="text" fontSize="sm" color="error" icon={<SendIcon />}>Text SM Error</Button>
            
                {/* Success color */}
                <Button type="solid" fontSize="xl" color="success" icon={<SendIcon />}>Solid XL Success</Button>
                <Button type="outlined" fontSize="lg" color="success" icon={<SendIcon />}>Outlined LG Success</Button>
                <Button type="dashed" fontSize="md" color="success" icon={<SendIcon />}>Dashed MD Success</Button>
                <Button type="filled" fontSize="ms" color="success" icon={<SendIcon />}>Filled MS Success</Button>
                <Button type="text" fontSize="sm" color="success" icon={<SendIcon />}>Text SM Success</Button>
            </div>
            
            <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(5, auto)", alignItems: 'center' }}>
                  {/* Default color */}
                <Input type="solid" size="xl" color="default" icon={<SendIcon />} placeholder="Solid XL Default" />
                <Input type="outlined" size="lg" color="default" icon={<SendIcon />} placeholder="Outlined LG Default" />
                <Input type="dashed" size="md" color="default" icon={<SendIcon />} placeholder="Dashed MD Default" />
                <Input type="filled" size="ms" color="default" icon={<SendIcon />} placeholder="Filled MS Default" />
                <Input type="text" size="sm" color="default" icon={<SendIcon />} placeholder="Text SM Default" />
        
                {/* Primary color */}
                <Input type="solid" size="xl" color="primary" icon={<SendIcon />} placeholder="Solid XL Primary" />
                <Input type="outlined" size="lg" color="primary" icon={<SendIcon />} placeholder="Outlined LG Primary" />
                <Input type="dashed" size="md" color="primary" icon={<SendIcon />} placeholder="Dashed MD Primary" />
                <Input type="filled" size="ms" color="primary" icon={<SendIcon />} placeholder="Filled MS Primary" />
                <Input type="text" size="sm" color="primary" icon={<SendIcon />} placeholder="Text SM Primary" />
        
                {/* Info color */}
                <Input type="solid" size="xl" color="info" icon={<SendIcon />} placeholder="Solid XL Info" />
                <Input type="outlined" size="lg" color="info" icon={<SendIcon />} placeholder="Outlined LG Info" />
                <Input type="dashed" size="md" color="info" icon={<SendIcon />} placeholder="Dashed MD Info" />
                <Input type="filled" size="ms" color="info" icon={<SendIcon />} placeholder="Filled MS Info" />
                <Input type="text" size="sm" color="info" icon={<SendIcon />} placeholder="Text SM Info" />
        
                {/* Warning color */}
                <Input type="solid" size="xl" color="warning" icon={<SendIcon />} placeholder="Solid XL Warning" />
                <Input type="outlined" size="lg" color="warning" icon={<SendIcon />} placeholder="Outlined LG Warning" />
                <Input type="dashed" size="md" color="warning" icon={<SendIcon />} placeholder="Dashed MD Warning" />
                <Input type="filled" size="ms" color="warning" icon={<SendIcon />} placeholder="Filled MS Warning" />
                <Input type="text" size="sm" color="warning" icon={<SendIcon />} placeholder="Text SM Warning" />
        
                {/* Error color */}
                <Input type="solid" size="xl" color="error" icon={<SendIcon />} placeholder="Solid XL Error" />
                <Input type="outlined" size="lg" color="error" icon={<SendIcon />} placeholder="Outlined LG Error" />
                <Input type="dashed" size="md" color="error" icon={<SendIcon />} placeholder="Dashed MD Error" />
                <Input type="filled" size="ms" color="error" icon={<SendIcon />} placeholder="Filled MS Error" />
                <Input type="text" size="sm" color="error" icon={<SendIcon />} placeholder="Text SM Error" />
        
                {/* Success color */}
                <Input type="solid" size="xl" color="success" icon={<SendIcon />} placeholder="Solid XL Success" />
                <Input type="outlined" size="lg" color="success" icon={<SendIcon />} placeholder="Outlined LG Success" />
                <Input type="dashed" size="md" color="success" icon={<SendIcon />} placeholder="Dashed MD Success" />
                <Input type="filled" size="ms" color="success" icon={<SendIcon />} placeholder="Filled MS Success" />
                <Input type="text" size="sm" color="success" icon={<SendIcon />} placeholder="Text SM Success" />
            </div>
        </div>
    );
}
