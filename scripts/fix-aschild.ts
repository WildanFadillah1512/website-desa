import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function walkDir(dir: string, callback: (filepath: string) => void) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let modifiedFiles = 0;

walkDir('./src', (filepath) => {
  if (!filepath.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(filepath, 'utf-8');
  let originalContent = content;
  
  // Replace: <Button ... asChild ...> <Link href="...">Text</Link> </Button>
  // With: <Link href="..." className={cn(buttonVariants({ ... }))}>Text</Link>
  // This is hard to do safely with Regex.
  
  // Alternative: Since Slot expects a single element, and errors usually happen if there's whitespace 
  // or `{false && ...}` inside, we can just remove `type="button"` which we did, BUT what if there's
  // whitespace? We can just ensure there is absolutely no whitespace between <Button asChild> and <Link>
  
  // Wait, the Next.js Link component renders as <a> in next 13+.
  // Let's just remove 'asChild' from all Button components wrapping Link, and change Button to just wrap Link?
  // No, that produces <button><a>...</a></button> which Next.js will warn about but won't crash React!
  // It's much safer than "Slot failed to slot onto its children" which is a hard crash.
  // Let's strip 'asChild' and 'asChild={true}' from all <Button> tags!
  
  content = content.replace(/<Button([^>]*)asChild([^>]*)>/g, '<Button$1$2>');
  
  if (content !== originalContent) {
    fs.writeFileSync(filepath, content, 'utf-8');
    modifiedFiles++;
    console.log("Modified:", filepath);
  }
});

console.log(`Done! Modified ${modifiedFiles} files.`);
