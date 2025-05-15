# Convert-DistTagsToMarkdown.ps1
# Converts dist-tags JSON data to Markdown format

$results = Get-Content -Path "data/dist-tags.json" -Raw | ConvertFrom-Json

# Generate Markdown
$md = @("# Verdaccio NPM Package Dist-Tags`n")
foreach ($entry in $results) {
    $md += "## $($entry.Package)`n"
    if ($entry.Tags.Count -eq 0) {
        if ($entry.PSObject.Properties.Match('Error')) {
            $md += "_Error: $($entry.Error)_`n"
        } else {
            $md += "_No dist-tags found._`n"
        }
        continue
    }
    $md += "| Tag | Version | Publish Date |"
    $md += "|-----|---------|--------------|"
    foreach ($tag in $entry.Tags) {
        $md += "| $($tag.Tag) | $($tag.Version) | $($tag.PublishDate) |"
    }
    $md += ""
}

$mdText = $md -join "`n"
Set-Content -Path "output/dist-tags.md" -Value $mdText -Encoding UTF8
Write-Host "Markdown report generated in dist-tags.md" 